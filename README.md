# Homeward Bound

A physics-based puzzle game challenging players to navigate a spacecraft through complex gravitational fields using realistic n-body gravitational simulations.

## About

*Homeward Bound* takes trajectory gaming to the next level by implementing true n-body gravitational physics. Unlike traditional games that rely on simple parabolic motion, this game creates unique and dynamic flight paths through the precise calculation of gravitational interactions between multiple celestial bodies.

Players must guide their spacecraft back to Earth by strategically utilizing the gravitational fields of various planetary bodies. The game progressively increases in complexity as each level introduces additional celestial objects, requiring players to master advanced techniques like gravitational slingshots - the same method used in actual space missions.

## Gameplay

Players control their spacecraft's initial trajectory through two key parameters:
- Velocity (ranging from 1 to 15 units)
- Launch angle (ranging from -90° to 90°)

The game features a real-time trajectory preview system powered by a Runge-Kutta 4th order integration method, allowing players to visualize their spacecraft's path through the gravitational fields before launch.

## Technical Implementation

### Physics Engine

The game's core physics engine is built on classical Newtonian gravitational physics. The gravitational force between objects is calculated using Newton's universal law of gravitation:

$F = \frac{G(m₁m₂)}{r²}$

Where:
- F = gravitational force
- G = gravitational constant
- m₁, m₂ = masses of the two objects
- r = distance between the objects

This creates a dynamic system where:
- Gravitational influence increases with larger masses
- Force decreases with the square of the distance
- Doubling the distance reduces gravitational force to one-fourth

### Trajectory Calculation

The game uses the Runge-Kutta 4th order method (RK4) to ensure accurate trajectory calculations. This numerical integration technique computes four acceleration estimates at different points:

1. k₁: Initial acceleration at current position
2. k₂: Acceleration at estimated midpoint
3. k₃: Acceleration at refined midpoint using k₁
4. k₄: Acceleration at predicted endpoint

These estimates are then weighted and combined to update the spacecraft's velocity and position vectors, resulting in smooth and physically accurate trajectories that reflect complex gravitational interactions between multiple bodies.

## Development

Clone the repo and run `npm install`.

## License

MIT