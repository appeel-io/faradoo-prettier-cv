
# Prettier Faradoo cv's

Faradoo CV Creator is a command-line tool that allows you to easily create beautiful CVs from the information stored in your Faradoo account.


## Installation

To install faradoo-prettier-cv, you must have Node.js and npm installed on your machine. Once you have Node.js and npm, you can install it by running the following commands

Copy the repo
```bash
  git clone https://github.com/appeel-io/faradoo-prettier-cv.git
```
Go in to your folder
```bash
  cd faradoo-prettier-cv
```
Install the dependencies
```bash
  npm install
```
    
## Usage

```bash
npm run generate
```
To get started, run the command above and log in to your Faradoo account via the command line.
Answer some questions for creating the ideal cv's for your needs and your done.

To add a logo you can just drop a image in the **public/logos** folder and the cli tool recognises it automatically.

If you want personal images on your generated cv's you can add them to the **public/employees** folder. To match the image to the right person the image needs to have the same name as the person in all lowercase and the whitespaces must be underscores.

example file name **jeremy_mees.png**




## License

[MIT](https://choosealicense.com/licenses/mit/)

