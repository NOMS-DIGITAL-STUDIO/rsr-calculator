#Travel Card Kata
This is a simple JavaScript Kata to simulate a simple travel card system. There are three options for running it on your local system depending on whether you prefer NodeJS or Containers.

##Running in a browser
Simply open the ```index.htm``` file in chrome.

```bash
$ open index.htm
```

##Running with NodeJS
Start by ensuring the you have the most recent version of NodeJS and NPM installed.

###Pre-requisites
To find the current version of NodeJS installed on your system, run the following command in your preferred shell;

```bash
$ node -v
```

###Running the test suite
If you have all the Pre-requisites then you are ready to run the test suite. Call the following from your shell;

```bash
$ ./run.sh
```

##Running in a container
If you do not have or do not wish to have NodeJS installed on your system, then you can also use docker to run the test suite.

###Pre-requisites
Start by ensuring that you have Docker and Docker compose installed. If you do not please follow use the installer for your system <https://docs.docker.com/windows/>.

If this is the first time you have used Docker on Windows or Mac OSX then you will need to create a default VM to run your containers in. Follow <https://docs.docker.com/engine/installation/windows/> which will help you create a default machine for running the containers in.

To find the IP address you will need to connect to the HTML interface, run the following command in your preferred shell;

```bash
$ docker-machine ip
```

###Running the test suite
If you have all the Pre-requisites then you are ready to run the test suite. Call the following from your shell;

```bash
$ ./docker.sh
```
