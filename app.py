from flask import Flask, render_template

app = Flask(__name__)


@app.route("/")
def main():
    return render_template("index.html")


@app.route("/cats")
def cats():
    return render_template("cats.html")


@app.route("/dogs/<id>")
def dog(id):
    return "Dog"


if __name__ == "__main__":
    app.run()
