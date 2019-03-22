import flask
from flask_compress import Compress
from ncmdump.ncmdump import dump


app = flask.Flask(__name__)
# 配置最大上传文件体积
app.config['MAX_CONTENT_LENGTH'] = 40 * 1024 * 1024

# 应用压缩
Compress(app)


@app.route("/", methods=["GET", "POST"])
def index():
	return flask.render_template("index.html")


@app.route("/upload_ncm_music", methods=["GET", "POST"])
def upload():
	if flask.request.method == "POST":
		file = flask.request.files["file"]
		file_name = file.filename
		file_path = "static/file/" + file_name
		save_path = "static/file/"

		try:
			file.save(file_path)
		except:
			return_data = {
				"err_code": -1,
				"err_msg": "上传文件过程中出现错误"
			}
			return flask.jsonify(return_data)
		finally:
			try:
				output_file_name = dump(file_path)
				save_path += output_file_name

				return_data = {
					"err_code": 0,
					"err_msg": save_path
				}

				return flask.jsonify(return_data)
			except:
				return_data = {
					"err_code": -2,
					"err_msg": "文件转换过程出现错误"
				}

				return flask.jsonify(return_data)

	else:
		return


if __name__ == '__main__':
	app.run()
