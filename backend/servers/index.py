'''
Business: Manage Discord-like servers (guilds) - create, list, join servers
Args: event - dict with httpMethod, body, queryStringParameters
      context - object with attributes: request_id
Returns: HTTP response with server data
'''
import json
import os
import secrets
import psycopg2
from typing import Dict, Any

def generate_server_id() -> str:
    return f"SRV{secrets.token_hex(8).upper()}"

def generate_channel_id() -> str:
    return f"CHN{secrets.token_hex(8).upper()}"

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
        
        if method == 'GET':
            params = event.get('queryStringParameters', {})
            user_id = params.get('user_id') if params else None
            
            if user_id:
                cur.execute(
                    """SELECT s.id, s.server_id, s.name, s.icon_url, s.owner_id, s.created_at 
                       FROM servers s
                       JOIN server_members sm ON s.id = sm.server_id
                       WHERE sm.user_id = %s
                       ORDER BY s.created_at DESC""",
                    (user_id,)
                )
                servers = cur.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps([{
                        'id': s[0],
                        'server_id': s[1],
                        'name': s[2],
                        'icon_url': s[3],
                        'owner_id': s[4],
                        'created_at': str(s[5])
                    } for s in servers])
                }
        
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action', 'create')
            
            if action == 'create':
                name = body_data.get('name', '')
                user_id = body_data.get('user_id')
                
                if not name or not user_id:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Name and user_id required'})
                    }
                
                server_id = generate_server_id()
                
                cur.execute(
                    "INSERT INTO servers (server_id, name, owner_id) VALUES (%s, %s, %s) RETURNING id, server_id, name, icon_url, owner_id, created_at",
                    (server_id, name, user_id)
                )
                server = cur.fetchone()
                
                cur.execute(
                    "INSERT INTO server_members (server_id, user_id) VALUES (%s, %s)",
                    (server[0], user_id)
                )
                
                general_channel_id = generate_channel_id()
                cur.execute(
                    "INSERT INTO channels (channel_id, server_id, name, type, position) VALUES (%s, %s, %s, %s, %s)",
                    (general_channel_id, server[0], 'general', 'text', 0)
                )
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'id': server[0],
                        'server_id': server[1],
                        'name': server[2],
                        'icon_url': server[3],
                        'owner_id': server[4],
                        'created_at': str(server[5])
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
