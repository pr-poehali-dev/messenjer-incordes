'''
Business: Handle chat messages - send and retrieve messages from channels
Args: event - dict with httpMethod, body, queryStringParameters
      context - object with attributes: request_id
Returns: HTTP response with message data
'''
import json
import os
import secrets
import psycopg2
from typing import Dict, Any

def generate_message_id() -> str:
    return f"MSG{secrets.token_hex(8).upper()}"

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
            channel_id = params.get('channel_id') if params else None
            
            if not channel_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'channel_id required'})
                }
            
            cur.execute(
                """SELECT c.id FROM channels c WHERE c.channel_id = %s""",
                (channel_id,)
            )
            channel = cur.fetchone()
            
            if not channel:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Channel not found'})
                }
            
            cur.execute(
                """SELECT m.message_id, m.content, m.created_at, u.username, u.tag, u.avatar_url
                   FROM messages m
                   JOIN users u ON m.user_id = u.id
                   WHERE m.channel_id = %s
                   ORDER BY m.created_at DESC
                   LIMIT 50""",
                (channel[0],)
            )
            messages = cur.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps([{
                    'message_id': m[0],
                    'content': m[1],
                    'created_at': str(m[2]),
                    'author': {
                        'username': m[3],
                        'tag': m[4],
                        'avatar_url': m[5]
                    }
                } for m in messages])
            }
        
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            channel_id = body_data.get('channel_id')
            user_id = body_data.get('user_id')
            content = body_data.get('content', '')
            
            if not channel_id or not user_id or not content:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'channel_id, user_id and content required'})
                }
            
            cur.execute(
                """SELECT c.id FROM channels c WHERE c.channel_id = %s""",
                (channel_id,)
            )
            channel = cur.fetchone()
            
            if not channel:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Channel not found'})
                }
            
            message_id = generate_message_id()
            
            cur.execute(
                "INSERT INTO messages (message_id, channel_id, user_id, content) VALUES (%s, %s, %s, %s) RETURNING message_id, content, created_at",
                (message_id, channel[0], user_id, content)
            )
            message = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'message_id': message[0],
                    'content': message[1],
                    'created_at': str(message[2])
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
