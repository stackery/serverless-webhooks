module.exports.githubWebhookHandler = (event, context, callback) => {
  // get the GitHub secret from the environment variables
  const token = process.env.GITHUB_WEBHOOK_SECRET;
  // determine the type of GitHub event from the header
  const headers = event.headers;
  const githubEvent = headers['X-GitHub-Event'];
  const body = JSON.parse(event.body);
  // this determines the pusher's username for a push event, but lists the repo owner for other events
  const username = body.pusher ? body.pusher.name : body.repository.owner.login;
  const message = body.pusher ? `${username} pushed this awesomeness/atrocity through (delete as necessary)` : `The repo owner is ${username}.`
  // get repo variables
  const { repository } = body;
  const repo = repository.full_name;
  const url = repository.url;
  
  // check that a GitHub webhook secret variable exists, if not, return an error
  if (typeof token !== 'string') {
    let errMsg = 'Must provide a \'GITHUB_WEBHOOK_SECRET\' env variable';
    return callback(null, {
      statusCode: 401,
      headers: { 'Content-Type': 'text/plain' },
      body: errMsg,
    });
  }

  // print some messages to the CloudWatch console
  console.log('---------------------------------');
  console.log(`\nGithub-Event: "${githubEvent}" on this repo: "${repo}" at the url: ${url}.\n ${message}`);
  console.log('Contents of event.body below:');
  console.log(event.body);
  console.log('---------------------------------');

  // more advanced logic can go here

  // return a 200 response if the GitHub tokens match
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      input: event,
    }),
  };

  return callback(null, response);
};