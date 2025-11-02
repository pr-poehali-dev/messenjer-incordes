'''
Business: Real-time messaging API for channels and DMs
Args: event with httpMethod, body, headers (Authorization)
Returns: Messages, DM channels
'''

import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
import jwt
from typing import Dict, Any

DATABASE_URL = os.environ.get('DATABASE_URL')
JWT_SECRET = 'incordes_secret_key_2024_change_in_production'

def verify_token(auth_header: str):
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    token = auth_header.split(' ')[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        return payload.get('user_id')
    except:
        return None

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    user_id = verify_token(event.get('headers', {}).get('Authorization', ''))
    if not user_id:
        return {
            'statusCode': 401,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Unauthorized'})
        }
    
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            if action == 'send':
                channel_id = body.get('channel_id')
                content = body.get('content', '')
                
                cursor.execute(
                    """INSERT INTO messages (message_id, channel_id, user_id, content) 
                       VALUES (%s, %s, %s, %s) 
                       RETURNING id, message_id, content, created_at""",
                    (f"M{int(os.urandom(4).hex(), 16)}", channel_id, user_id, content)
                )
                message = dict(cursor.fetchone())
                conn.commit()
                
                cursor.execute(
                    "SELECT username, discriminator, incordes_id, avatar_url FROM users WHERE id = %s",
                    (user_id,)
                )
                author = dict(cursor.fetchone())
                message['author'] = author
                
                return {
                    'statusCode': 200,
                    'headers': {'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(message)
                }
            
            elif action == 'get_dm':
                friend_id = body.get('friend_id')
                
                cursor.execute(
                    """SELECT c.* FROM channels c 
                       WHERE c.is_dm = TRUE 
                       AND ((c.user_id = %s AND c.server_id = %s) OR (c.user_id = %s AND c.server_id = %s))
                       LIMIT 1""",
                    (user_id, friend_id, friend_id, user_id)
                )
                channel = cursor.fetchone()
                
                if not channel:
                    cursor.execute(
                        """INSERT INTO channels (channel_id, name, type, is_dm, user_id, server_id) 
                           VALUES (%s, %s, %s, %s, %s, %s) 
                           RETURNING id, channel_id""",
                        (f"DM{int(os.urandom(4).hex(), 16)}", 'Direct Message', 'direct', True, user_id, friend_id)
                    )
                    channel = cursor.fetchone()
                    conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(dict(channel))
                }
        
        elif method == 'GET':
            params = event.get('queryStringParameters', {}) or {}
            channel_id = params.get('channel_id')
            limit = int(params.get('limit', 50))
            
            if channel_id:
                cursor.execute(
                    """SELECT m.*, u.username, u.discriminator, u.incordes_id, u.avatar_url 
                       FROM messages m 
                       JOIN users u ON m.user_id = u.id 
                       WHERE m.channel_id = %s 
                       ORDER BY m.created_at DESC 
                       LIMIT %s""",
                    (channel_id, limit)
                )
                messages = [dict(row) for row in cursor.fetchall()]
                
                return {
                    'statusCode': 200,
                    'headers': {'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'messages': messages})
                }
        
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    finally:
        cursor.close()
        conn.close()
