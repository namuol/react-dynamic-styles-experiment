A quick experiment to see what an implementation of Radium might behave like if it generated
a `<style>` component rather than using inline styles + window event hooks.

## Approach

Whenever a wrapped component's `props.style` changes, dynamically generate a CSS rule to represent the changes (currently using `free-style` but a method using `insertStyle/deleteStyle` or something similar might be worth investigating).

## Running

```shell
npm install
npm start
# open http://0.0.0.0:3000
```
