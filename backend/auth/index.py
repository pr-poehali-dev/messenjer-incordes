'''
Business: User authentication and registration with unique Incordes ID generation
Args: event - dict with httpMethod, body (email, password, username)
      context - object with attributes: request_id, function_name
Returns: HTTP response with user data and Incordes ID or error
'''
import json
import os
import hashlib
import secrets
import psycopg2
from typing import Dict, Any

def generate_incordes_id() -> str:
    return f"INC{secrets.token_hex(8).upper()}"

def generate_tag() -> str:
    return str(secrets.randbelow(10000)).zfill(4)

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action', 'register')
            
            if action == 'register':
                email = body_data.get('email', '')
                password = body_data.get('password', '')
                username = body_data.get('username', '')
                
                if not email or not password or not username:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Email, password and username required'})
                    }
                
                incordes_id = generate_incordes_id()
                tag = generate_tag()
                password_hash = hash_password(password)
                
                cur.execute(
                    "INSERT INTO users (incordes_id, email, password_hash, username, tag) VALUES (%s, %s, %s, %s, %s) RETURNING id, incordes_id, email, username, tag, created_at",
                    (incordes_id, email, password_hash, username, tag)
                )
                user = cur.fetchone()
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'id': user[0],
                        'incordes_id': user[1],
                        'email': user[2],
                        'username': user[3],
                        'tag': user[4],
                        'created_at': str(user[5])
                    })
                }
            
            elif action == 'login':
                email = body_data.get('email', '')
                password = body_data.get('password', '')
                
                if not email or not password:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Email and password required'})
                    }
                
                password_hash = hash_password(password)
                
                cur.execute(
                    "SELECT id, incordes_id, email, username, tag, avatar_url, status FROM users WHERE email = %s AND password_hash = %s",
                    (email, password_hash)
                )
                user = cur.fetchone()
                
                if not user:
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Invalid credentials'})
                    }
                
                cur.execute(
                    "UPDATE users SET status = 'online', updated_at = CURRENT_TIMESTAMP WHERE id = %s",
                    (user[0],)
                )
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'id': user[0],
                        'incordes_id': user[1],
                        'email': user[2],
                        'username': user[3],
                        'tag': user[4],
                        'avatar_url': user[5],
                        'status': 'online'
                    })
                }
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
