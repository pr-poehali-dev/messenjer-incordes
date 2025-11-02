'''
Business: User authentication system with IncordesID generation (User#0001 format)
Args: event with httpMethod, body (email, password, username for register)
Returns: JWT token and user data with unique IncordesID
'''

import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
import bcrypt
import jwt
import hashlib
from datetime import datetime, timedelta
import random
import re
from typing import Dict, Any

DATABASE_URL = os.environ.get('DATABASE_URL')
JWT_SECRET = 'incordes_secret_key_2024_change_in_production'

def generate_discriminator(cursor, username: str) -> str:
    cursor.execute(
        "SELECT discriminator FROM users WHERE username = %s ORDER BY discriminator DESC LIMIT 1",
        (username,)
    )
    result = cursor.fetchone()
    
    if not result:
        return '0001'
    
    last_disc = int(result['discriminator'])
    new_disc = last_disc + 1
    
    if new_disc > 9999:
        new_disc = random.randint(1, 9999)
    
    return str(new_disc).zfill(4)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            if action == 'register':
                email = body.get('email', '').strip().lower()
                password = body.get('password', '')
                username = body.get('username', '').strip()
                
                if not email or not password or not username:
                    return {
                        'statusCode': 400,
                        'headers': {'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Email, password and username required'})
                    }
                
                if not re.match(r'^[a-zA-Z0-9_]{3,20}$', username):
                    return {
                        'statusCode': 400,
                        'headers': {'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Username must be 3-20 characters, alphanumeric and underscore only'})
                    }
                
                cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
                if cursor.fetchone():
                    return {
                        'statusCode': 400,
                        'headers': {'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Email already registered'})
                    }
                
                discriminator = generate_discriminator(cursor, username)
                incordes_id = f"{username}#{discriminator}"
                
                password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
                
                cursor.execute(
                    """INSERT INTO users (email, password_hash, username, discriminator, incordes_id, tag, status, theme, locale)
                       VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id, incordes_id, username, email, avatar_url, status, theme""",
                    (email, password_hash, username, discriminator, incordes_id, discriminator, 'online', 'dark', 'ru')
                )
                user = dict(cursor.fetchone())
                conn.commit()
                
                cursor.execute(
                    "INSERT INTO user_settings (user_id) VALUES (%s)",
                    (user['id'],)
                )
                conn.commit()
                
                token = jwt.encode({
                    'user_id': user['id'],
                    'incordes_id': user['incordes_id'],
                    'exp': datetime.utcnow() + timedelta(days=30)
                }, JWT_SECRET, algorithm='HS256')
                
                return {
                    'statusCode': 200,
                    'headers': {'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'token': token,
                        'user': user
                    })
                }
            
            elif action == 'login':
                email = body.get('email', '').strip().lower()
                password = body.get('password', '')
                
                if not email or not password:
                    return {
                        'statusCode': 400,
                        'headers': {'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Email and password required'})
                    }
                
                cursor.execute(
                    "SELECT id, password_hash, incordes_id, username, email, avatar_url, banner_url, bio, status, theme FROM users WHERE email = %s",
                    (email,)
                )
                user = cursor.fetchone()
                
                if not user:
                    return {
                        'statusCode': 401,
                        'headers': {'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Invalid credentials'})
                    }
                
                user_dict = dict(user)
                
                password_valid = False
                need_hash_update = False
                
                if user_dict['password_hash'].startswith('$2'):
                    password_valid = bcrypt.checkpw(password.encode('utf-8'), user_dict['password_hash'].encode('utf-8'))
                else:
                    sha256_hash = hashlib.sha256(password.encode()).hexdigest()
                    password_valid = sha256_hash == user_dict['password_hash']
                    need_hash_update = password_valid
                
                if not password_valid:
                    return {
                        'statusCode': 401,
                        'headers': {'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Invalid credentials'})
                    }
                
                if need_hash_update:
                    new_password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
                    cursor.execute("UPDATE users SET password_hash = %s WHERE id = %s", (new_password_hash, user_dict['id']))
                
                cursor.execute("UPDATE users SET status = %s WHERE id = %s", ('online', user_dict['id']))
                conn.commit()
                
                del user_dict['password_hash']
                
                token = jwt.encode({
                    'user_id': user_dict['id'],
                    'incordes_id': user_dict['incordes_id'],
                    'exp': datetime.utcnow() + timedelta(days=30)
                }, JWT_SECRET, algorithm='HS256')
                
                return {
                    'statusCode': 200,
                    'headers': {'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'token': token,
                        'user': user_dict
                    })
                }
            
            elif action == 'verify':
                token = body.get('token')
                if not token:
                    return {
                        'statusCode': 401,
                        'headers': {'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Token required'})
                    }
                
                try:
                    payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
                    user_id = payload['user_id']
                    
                    cursor.execute(
                        "SELECT id, incordes_id, username, email, avatar_url, banner_url, bio, status, theme FROM users WHERE id = %s",
                        (user_id,)
                    )
                    user = cursor.fetchone()
                    
                    if not user:
                        return {
                            'statusCode': 401,
                            'headers': {'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'User not found'})
                        }
                    
                    return {
                        'statusCode': 200,
                        'headers': {'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'user': dict(user)})
                    }
                except jwt.ExpiredSignatureError:
                    return {
                        'statusCode': 401,
                        'headers': {'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Token expired'})
                    }
                except jwt.InvalidTokenError:
                    return {
                        'statusCode': 401,
                        'headers': {'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Invalid token'})
                    }
        
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    finally:
        cursor.close()
        conn.close()