# chrome-extension

> a very useful chrome extension

- it can block some script
- it has some useful functions you will use it frequently
- you can add your custom script to some websites

## Add your custom script

1. find `src/script/content/`folder
2. add a your `www.example.com.js` file, and write your script into it, this script will work in `www.example.com`
3. `npm run dev` or `npm run build` to generate `content_script.js`file

## Enable this extension

- You need have a [Chrome browser](https://www.google.com/chrome/)
- clone this project
- Open Chrome browser, and select `Settings` - `Extensions` - `Load unpacked`, and choose this project from your local disk

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```
