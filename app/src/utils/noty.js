import Noty from 'noty';
import 'noty/src/noty.scss';
import 'noty/src/themes/bootstrap-v4.scss';

const Bounce = require('bounce.js');

Noty.overrideDefaults({
  layout: 'bottomRight',
  theme: 'bootstrap-v4',
  killer: true,
  closeWith: ['click', 'button'],
  timeout: 4000,
  animation: {
    animation: {
      open(promise) {
        const n = this;
        new Bounce()
          .translate({
            from: { x: 450, y: 0 },
            to: { x: 0, y: 0 },
            easing: 'bounce',
            duration: 1000,
            bounces: 4,
            stiffness: 3,
          })
          .scale({
            from: { x: 1.2, y: 1 },
            to: { x: 1, y: 1 },
            easing: 'bounce',
            duration: 1000,
            delay: 100,
            bounces: 4,
            stiffness: 1,
          })
          .scale({
            from: { x: 1, y: 1.2 },
            to: { x: 1, y: 1 },
            easing: 'bounce',
            duration: 1000,
            delay: 100,
            bounces: 6,
            stiffness: 1,
          })
          .applyTo(n.barDom, {
            onComplete() {
              promise((resolve) => {
                resolve();
              });
            },
          });
      },

      close(promise) {
        const n = this;
        new Bounce()
          .translate({
            from: { x: 0, y: 0 },
            to: { x: 450, y: 0 },
            easing: 'bounce',
            duration: 500,
            bounces: 4,
            stiffness: 1,
          })
          .applyTo(n.barDom, {
            onComplete() {
              promise((resolve) => {
                resolve();
              });
            },
          });
      },
    },
  },
});
