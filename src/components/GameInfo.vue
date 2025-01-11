<template>
  <v-menu location="top" open-on-hover :close-on-content-click="false">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" icon="mdi-information-outline" variant="text" density="compact"></v-btn>
    </template>
    <v-card max-width="730" max-height="600" class="overflow-y-auto" variant="outlined" color="light-green-lighten-2">
      <v-card-text>
        <v-row class="text-justify">
          <v-col>
            <p>
              <span class="text-h6">About</span>
            </p>
            <p>
              <i>Homeward Bound</i> is a physics-based puzzle game that challenges players to navigate a spacecraft
              through
              complex gravitational fields to reach Earth. Unlike traditional trajectory games that use simple parabolic
              motion, this game implements an n-body gravitational simulation that creates unique and dynamic flight
              paths.
            </p>
            <p class="pt-2">
              Each level adds more planetary bodies, increasing the complexity of the gravitational interactions.
              Players
              must use these gravitational fields strategically, sometimes using a planet's gravity to slingshot the
              spacecraft toward Earth - a technique actually used in real space missions.
            </p>
            <p class="pt-2">
              <span class="text-h6">How It Works</span>
            </p>
            <p>
              Players control two key parameters:
            </p>
            <ul class="pl-4 pt-2">
              <li>Velocity (1-15 units)</li>
              <li>Angle (-90° to 90°)</li>
            </ul>
            <p class="pt-2">
              The game renders a real-time trajectory preview using a Runge-Kutta 4th order integration method, allowing
              players to visualize how their spacecraft will interact with the gravitational fields of multiple
              planetary
              bodies before launching.
            </p>
            <p class="pt-2">
              <span class="text-h6">The Mathematics</span>
            </p>
            <p>
              The core of the game uses classical Newtonian gravitational physics, calculating forces between the
              spacecraft
              and all celestial bodies using the formula:
            </p>
            <div v-html="newtonianFormula"></div>
            <p class="pt-2">
              This formula shows that the gravitational force <span v-html="fInline"></span> between two objects depends
              on
              their masses <span v-html="m1Inline"></span> and <span v-html="m2Inline"></span> and the square of the
              distance
              between them <span v-html="r2Inline"></span>. <span v-html="gInline"></span> is the gravitational
              constant.
              The force gets stronger when the masses are larger, and weaker when objects are farther apart. In fact,
              doubling the distance reduces the force to one-fourth of its original strength. In the game, this creates
              interesting dynamics where planets have a strong pull on the spacecraft when it's nearby, but their
              influence
              quickly fades with distance.
            </p>
            <p class="pt-2">
              To calculate the spacecraft's path accurately, the game uses the Runge-Kutta 4th order method (RK4) to
              integrate Newton's equations of motion. The method calculates four acceleration estimates at different
              points
              to predict how the spacecraft's velocity and position change over time:
            </p>
            <ul class="pl-4 pt-2">
              <li><span v-html="k1Inline"></span>: Acceleration at the current position</li>
              <li><span v-html="k2Inline"></span>: Acceleration at an estimated midpoint position</li>
              <li><span v-html="k3Inline"></span>: Acceleration at a refined midpoint using <span
                  v-html="k1Inline"></span>
              </li>
              <li><span v-html="k4Inline"></span>: Acceleration at the predicted endpoint</li>
            </ul>
            <p class="pt-2">
              These four acceleration estimates are then weighted and combined to accurately update the spacecraft's
              velocity and position. This method is essential for capturing the complex gravitational interactions and
              produces the smooth, realistic trajectories you see in the game.
            </p>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script>
import katex from 'katex';
import 'katex/dist/katex.min.css';

export default {
  data() {
    return {
      // The Newtonian gravitational formula in LaTeX
      formula: `F = \\frac{G m_1 m_2}{r^2}`,
      f: `F`,
      m1: `m_{1}`,
      m2: `m_{2}`,
      r2: `r^2`,
      g: `G`,
      k1: `k_{1}`,
      k2: `k_{2}`,
      k3: `k_{3}`,
      k4: `k_{4}`,
    };
  },
  computed: {
    newtonianFormula() {
      // Render the LaTeX formula using KaTeX
      return katex.renderToString(this.formula, {
        throwOnError: false, // Prevents errors from breaking the app
        displayMode: true,   // Renders the formula in display mode
      });
    },
    fInline() {
      // Render the LaTeX inline formula using KaTeX
      return katex.renderToString(this.f, {
        throwOnError: false, // Prevents errors from breaking the app
        displayMode: false,  // Renders the formula in inline mode
      });
    },
    m1Inline() {
      return katex.renderToString(this.m1, {
        throwOnError: false,
        displayMode: false,
      });
    },
    m2Inline() {
      return katex.renderToString(this.m2, {
        throwOnError: false,
        displayMode: false,
      });
    },
    r2Inline() {
      return katex.renderToString(this.r2, {
        throwOnError: false,
        displayMode: false,
      });
    },
    gInline() {
      return katex.renderToString(this.g, {
        throwOnError: false,
        displayMode: false,
      });
    },
    k1Inline() {
      return katex.renderToString(this.k1, {
        throwOnError: false,
        displayMode: false,
      });
    },
    k2Inline() {
      return katex.renderToString(this.k2, {
        throwOnError: false,
        displayMode: false,
      });
    },
    k3Inline() {
      return katex.renderToString(this.k3, {
        throwOnError: false,
        displayMode: false,
      });
    },
    k4Inline() {
      return katex.renderToString(this.k4, {
        throwOnError: false,
        displayMode: false,
      })
    }
  },
};
</script>