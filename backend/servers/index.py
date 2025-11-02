'''
Business: Server management API for creating/joining servers and channels
Args: event with httpMethod, body, headers (Authorization)
Returns: Server data, channels, members, invite codes
'''

import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
import jwt
import secrets
import string
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

def generate_invite_code():
    return ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(8))

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
            
            if action == 'create':
                name = body.get('name', 'New Server')
                icon_url = body.get('icon_url')
                
                cursor.execute(
                    "INSERT INTO servers (server_id, name, icon_url, owner_id) VALUES (%s, %s, %s, %s) RETURNING id, server_id, name, icon_url, owner_id",
                    (f"S{int(os.urandom(4).hex(), 16)}", name, icon_url, user_id)
                )
                server = dict(cursor.fetchone())
                server_id = server['id']
                
                cursor.execute(
                    "INSERT INTO channels (channel_id, server_id, name, type, position) VALUES (%s, %s, %s, %s, %s)",
                    (f"C{int(os.urandom(4).hex(), 16)}", server_id, 'general', 'text', 0)
                )
                
                cursor.execute(
                    "INSERT INTO channels (channel_id, server_id, name, type, position) VALUES (%s, %s, %s, %s, %s)",
                    (f"C{int(os.urandom(4).hex(), 16)}", server_id, 'General', 'voice', 1)
                )
                
                cursor.execute(
                    "INSERT INTO server_members (server_id, user_id) VALUES (%s, %s)",
                    (server_id, user_id)
                )
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(server)
                }
            
            elif action == 'create_channel':
                server_id = body.get('server_id')
                name = body.get('name', 'new-channel')
                channel_type = body.get('type', 'text')
                
                cursor.execute(
                    "SELECT COUNT(*) as count FROM channels WHERE server_id = %s",
                    (server_id,)
                )
                position = dict(cursor.fetchone())['count']
                
                cursor.execute(
                    "INSERT INTO channels (channel_id, server_id, name, type, position) VALUES (%s, %s, %s, %s, %s) RETURNING id, channel_id, name, type",
                    (f"C{int(os.urandom(4).hex(), 16)}", server_id, name, channel_type, position)
                )
                channel = dict(cursor.fetchone())
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(channel)
                }
            
            elif action == 'join':
                invite_code = body.get('invite_code')
                
                cursor.execute(
                    "SELECT * FROM server_invites WHERE code = %s AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP) AND (max_uses = 0 OR uses < max_uses)",
                    (invite_code,)
                )
                invite = cursor.fetchone()
                
                if not invite:
                    return {
                        'statusCode': 404,
                        'headers': {'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Invalid invite'})
                    }
                
                invite_dict = dict(invite)
                server_id = invite_dict['server_id']
                
                cursor.execute(
                    "SELECT id FROM server_members WHERE server_id = %s AND user_id = %s",
                    (server_id, user_id)
                )
                if cursor.fetchone():
                    return {
                        'statusCode': 400,
                        'headers': {'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Already a member'})
                    }
                
                cursor.execute(
                    "INSERT INTO server_members (server_id, user_id) VALUES (%s, %s)",
                    (server_id, user_id)
                )
                
                cursor.execute(
                    "UPDATE server_invites SET uses = uses + 1 WHERE id = %s",
                    (invite_dict['id'],)
                )
                
                cursor.execute(
                    "SELECT * FROM servers WHERE id = %s",
                    (server_id,)
                )
                server = dict(cursor.fetchone())
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(server)
                }
            
            elif action == 'create_invite':
                server_id = body.get('server_id')
                channel_id = body.get('channel_id')
                max_age = body.get('max_age', 0)
                max_uses = body.get('max_uses', 0)
                
                code = generate_invite_code()
                expires_at = None
                if max_age > 0:
                    cursor.execute("SELECT CURRENT_TIMESTAMP + INTERVAL '%s seconds' AS expires_at", (max_age,))
                    expires_at = dict(cursor.fetchone())['expires_at']
                
                cursor.execute(
                    "INSERT INTO server_invites (code, server_id, channel_id, inviter_id, max_uses, max_age, expires_at) VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING code",
                    (code, server_id, channel_id, user_id, max_uses, max_age, expires_at)
                )
                invite = dict(cursor.fetchone())
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(invite)
                }
        
        elif method == 'GET':
            params = event.get('queryStringParameters', {}) or {}
            
            if params.get('user_servers'):
                cursor.execute(
                    """SELECT s.* FROM servers s 
                       JOIN server_members sm ON s.id = sm.server_id 
                       WHERE sm.user_id = %s 
                       ORDER BY sm.joined_at DESC""",
                    (user_id,)
                )
                servers = [dict(row) for row in cursor.fetchall()]
                
                return {
                    'statusCode': 200,
                    'headers': {'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'servers': servers})
                }
            
            server_id = params.get('server_id')
            if server_id:
                cursor.execute("SELECT * FROM servers WHERE id = %s", (server_id,))
                server = dict(cursor.fetchone() or {})
                
                cursor.execute(
                    "SELECT * FROM channels WHERE server_id = %s ORDER BY position",
                    (server_id,)
                )
                channels = [dict(row) for row in cursor.fetchall()]
                
                cursor.execute(
                    """SELECT u.id, u.username, u.discriminator, u.incordes_id, u.avatar_url, u.status 
                       FROM users u 
                       JOIN server_members sm ON u.id = sm.user_id 
                       WHERE sm.server_id = %s""",
                    (server_id,)
                )
                members = [dict(row) for row in cursor.fetchall()]
                
                server['channels'] = channels
                server['members'] = members
                
                return {
                    'statusCode': 200,
                    'headers': {'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(server)
                }
        
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    finally:
        cursor.close()
        conn.close()
