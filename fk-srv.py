# -*- coding: utf-8 -*-

from flask import send_file



from flask import Flask, request, url_for
app = Flask(__name__)

@app.route("/")
def hello():
    return send_file("templates/index.html")

# @app.route('/user', methods=['POST']) #默认是get方式
# def hello_user():
#     return 'hello user'
# @app.route('/users/<id>')   #传递参数方式1 访问localhost:7999/users/10
# def user_id(id):
#     return 'hello world'+id
#
# @app.route('/query_user', methods=['POST']) #传递参数方式2 访问localhost:7999/users?id=10
# def query_user():
#     id = request.args.get('id')
#     return 'query_user:'+id
#
# @app.route('/query_url')
# def query_url():
#     return 'query_url：：:'+url_for('query_user') #反倒上面query_user函数的URL
# #反向路由就是从视图函数反倒出URL地址
if __name__ == "__main__":
    # app.debug = True
    app.run(port=8005, host='0.0.0.0')