from flask import Flask, jsonify, request, render_template, send_from_directory
import sqlite3
import time
import re
import random
import string

def create_database():
    # Connect to the SQLite database (or create it if it doesn't exist)
    conn = sqlite3.connect('messages.db')
    cursor = conn.cursor()

    # Create a table with the specified columns
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            message TEXT,
            svg_data TEXT,
            img_ref TEXT,
            reply_references TEXT
        )
    ''')

    # Commit the changes and close the connection
    conn.commit()
    conn.close()

def is_valid_svg(input_string):
    # Regular expression to match the specified SVG format
    svg_pattern = r'^<svg xmlns="http://www.w3.org/2000/svg" width="\d+" height="\d+"><image href="data:image/octet-stream;base64,[A-Za-z0-9+/=]+" width="400" height="400" /></svg>$'
    
    # Match the input string against the pattern
    return bool(re.match(svg_pattern, input_string))

def insert_message(date, message="", svg_data="", reply_references=""):
    conn = sqlite3.connect('messages.db')
    cursor = conn.cursor()

    cursor.execute('''
        INSERT INTO messages (date, message, svg_data, reply_references)
        VALUES (?, ?, ?, ?)
    ''', (date, message, svg_data, reply_references))
    conn.commit()
    conn.close()

def get_random_messages(count):
    conn = sqlite3.connect('messages.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM messages ORDER BY RANDOM() LIMIT ?', (count,))
    colums = [column[0] for column in cursor.description]
    items = cursor.fetchall()
    items_dict = [dict(zip(colums, row)) for row in items]
    conn.close()
    return items_dict

app = Flask(__name__)

@app.route('/api/submit-message', methods=['POST'])
def SubMessage():

    data = request.get_json()

    if not data:
        return jsonify({"error", "Invalid Request"}, 400)

    message = data.get('message', "")
    svg_data = data.get('svgd', '')
    date = int(time.time())

    if svg_data != '' and not is_valid_svg(svg_data):
        print("SVG Error")
        return jsonify(message="403")
    
    if svg_data != '':
        fileID = random_string = ''.join(random.choices(string.ascii_letters + string.digits, k=10))
        with open(f'public/uimg/{fileID}.svg', 'w') as file:
            file.write(svg_data)
        svg_data = f'public/uimg/{fileID}.svg'

    print(message, svg_data, date)

    insert_message(date=date, message=message, svg_data=svg_data)

    return jsonify(message="200")

@app.route('/api/get-messages', methods=["GET"])
def GetMessages():
    try:
        count = int(request.args.get('count', 1))
        count = max(0, min(count, 20))
        messages = get_random_messages(count)
        return jsonify(messages)
    except:
        return jsonify([])


@app.route('/hello', methods=['GET'])
def hello():
    name = request.args.get('name', 'World')
    return jsonify(message="Hello, " + name)

@app.route('/')
def index():
    return send_from_directory('', "test.html")

@app.route('/public/<path:filename>')
def public_files(filename):
    return send_from_directory('public', filename)

if __name__ == '__main__':
    create_database()
    app.run(debug=True)
