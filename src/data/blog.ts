import { BlogPost } from '../types';

export const blogPosts: BlogPost[] = [
  {
    id: 'post-1',
    title: 'Designing our Stealth Chassis: The Offseason Prototype',
    excerpt: 'How we transitioned to custom plate designs, testing 4-wheel mecanum and low-CG battery mounts for swift maneuvering.',
    content: `### Transitioning to our Custom Plate Chassis

This offseason, Team Vortex is pushing boundaries. After competing last season with a kit-of-parts chassis, we identified major bottlenecks in our agility and ground-clearance. To tackle these, we designed our **Stealth Chassis**, a fully custom plate-based mecanum drivetrain.

#### Key Design Priorities:
1. **Low Center of Gravity**: We recessed our REV Hubs and the heavy-duty LiPo battery into the bottom drawer plates, preventing tip-overs during aggressive center-field battles.
2. **Modular Subassemblies**: The intake sits on slide rods that can be detached with four thumbscrews, meaning we can swap our scoring mechanism in less than 2 minutes.
3. **Weight Reduction**: By pockets machining our 3mm robust 6061 aluminium plates, we shaved 3.4 lbs while retaining structural rigidity.

Next month, we will begin machining the physical plates on our sponsor’s CNC router. We can’t wait to get our hands dirty and start wiring the final frame!`,
    date: 'June 1, 2026',
    author: 'Alex Rivera',
    category: 'Build & Hardware',
    tags: ['CAD', 'Mecanum', 'Offseason', 'CNC'],
    readTime: '4 min read'
  },
  {
    id: 'post-2',
    title: 'AprilTags and AprilFooling: Calibrating Limelight 3G Sensors',
    excerpt: 'Mastering reliable autonomous target tracking during high-speed transitions and under fluctuating venue lighting.',
    content: `### Perfecting our Coordinate Space with Limelight

Autonomous planning in FIRST Tech Challenge requires absolute precision. Even 1 degree of heading error can cause our robot to miss the bucket entirely. To lock down our scoring coordinates, we integrated a **Limelight 3G** processing camera.

#### Finding the Right Calibration
At first, we noticed significant ghosting and coordinate drift. It turned out to be two factors:
- **Dynamic exposure settings**: Venue lighting changes when spectators crowd the area. We wrote a quick ambient-balancing threshold algorithm.
- **Vibration**: Fast stops caused the camera shaft to wiggle. We 3D-printed a custom TPU shock-absorbing mounting jacket.

#### Our Results:
Now, our robot locates field AprilTags from up to **12 feet away** in under **10 milliseconds**, giving our software the perfect real-time (x, y, θ) field coordinates. Detailed code snippets for our alignment loops are uploaded in our **Resources Section**, check them out!`,
    date: 'May 14, 2026',
    author: 'Sarah Chen',
    category: 'Programming & Control',
    tags: ['Vision', 'Limelight', 'AprilTags', 'Odometry'],
    readTime: '5 min read'
  },
  {
    id: 'post-3',
    title: 'Spreading STEAM: Middle School Robotics Workshop Series',
    excerpt: 'Team Vortex hosted a successful workshop introducing 42 middle school students to block-programming and mechanical gears.',
    content: `### Inspiring the Next Generation

At FTC Vortex, we believe the ultimate robot is the one that builds the future. Last Saturday, we hosted a packed workshop in our school lab to introduce local middle school students to STEM concepts.

Using modular educational bricks, we guided the students through constructing a simple active climbing car. In the second half of the day, we held a mini "Sumo Robot" face-off.

#### Workshop Highlights:
- Over **42 amazing students** attended, 60% of whom had never built a web or physical robot before!
- Special mentoring rounds led by our junior team members, helping them develop communication skills.
- Sponsored gift cards awarded for the "Most Innovative Intake" and "Best Engineering Teamwork".

We plan to expand our outreach to neighboring libraries in July! Check out our Engineering Notebook to see how you can collaborate.`,
    date: 'April 28, 2026',
    author: 'Emily Taylor',
    category: 'Outreach & CAD',
    tags: ['Outreach', 'Workshop', 'STEM', 'Community'],
    readTime: '3 min read'
  },
  {
    id: 'post-4',
    title: 'Season Prep: Choosing custom gear ratios for yellow jackets',
    excerpt: 'An empirical comparison between 19.2:1 and 13.7:1 motor gearboxes for custom scoring and intake speeds.',
    content: `### Finding the Ultimate Torque-to-Speed Balance

As we prepare for the upcoming FTC season, choosing the optimal gear ratios for our subsystems is critical. High speed looks impressive, but burning out motors mid-match is an outreach disaster. We ran several bench test runs:

- **Drivetrain (19.2:1 @ 312RPM)**: The gold standard. Perfect balance of speed and defensive torque. Tested climbing and traversing 10-degree incline pads successfully.
- **Intake Arm (50.9:1 @ 117RPM)**: High reduction allows the heavy grabber assembly to stay suspended without drawing continuous holding current (minimizing battery drain).
- **Viper Scoring Slide (13.7:1 @ 435RPM)**: Ultra-fast extension. Reaches maximum height in only **0.8 seconds!**

For specific mechanical calculations, see our spreadsheet template available in the **CAD & Hardware Resources** section below.`,
    date: 'March 11, 2026',
    author: 'Marcus Vance',
    category: 'Build & Hardware',
    tags: ['Motors', 'Hardware', 'Physics', 'Design'],
    readTime: '6 min read'
  }
];
