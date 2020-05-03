# Serverless-Flask

The fastest way to a Flask application with [Serverless](https://github.com/serverless/serverless).

## Usage

Now per default (node >= 10.\*), **npx** is pre-installed which makes the next line optional.
However, this is still recommended.

```bash
$ npm install -g serverless # Optional
$ (npx) serverless install --url https://github.com/jolo-dev/serverless-flask --name my-flask-app
$ cd my-flask-app && npm run setup
<answer prompts>
$ (npx) serverless deploy
```

Once the deploy is complete, run `sls info` to get the endpoint:

```bash
$ sls info
Service Information
<snip>
endpoints:
  ANY - https://abc6defghi.execute-api.us-east-1.amazonaws.com/dev <-- Endpoint
  ANY - https://abc6defghi.execute-api.us-east-1.amazonaws.com/dev/{proxy+}
```

Copy paste into your browser, and _voila_!

## Local development

To develop locally, create a virtual environment and install your dependencies:

```bash
virtualenv venv
source venv/bin/activate
pip install -r requirements.txt
```

Then, run your app:

```bash
sls wsgi serve
 * Running on http://localhost:5000/ (Press CTRL+C to quit)
 * Restarting with stat
 * Debugger is active!
```

Navigate to [localhost:5000](http://localhost:5000) to see your app running locally.

## Configuration

The `setup.js` prompt will walk you through some setup questions that may be
custom to your use case. This includes:

- Name of the Service
- Python runtime version;
- Where to deploy
- Whether you have Docker setup, which assists in packaging dependencies. For more info, check out [this post on managing your Python packages with Serverless](https://serverless.com/blog/serverless-python-packaging/);
- Whether you want to set up a custom domain that you own, rather than a random assigned one from AWS. For more details on that, look at [this post on setting up a custom domain with API Gateway and Serverless](https://serverless.com/blog/serverless-api-gateway-domain/).
