import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, Lightbulb, CheckCircle, ChevronRight, AlertCircle, BookOpen, 
  Cpu, Share2, HelpCircle, Award, Zap, ArrowLeft, RotateCcw, 
  Sparkles, Layers, Activity, ChevronDown, Clock, Wrench, 
  TrendingUp, Sliders, Play, Settings, Database, Eye, EyeOff, Layout, FileText
} from 'lucide-react';

interface Topic {
  id: string;
  title: string;
  shortDesc: string;
  explanation: string;
  practicalTip: string;
  quizQuestion: string;
  quizOptions: string[];
  correctOptionIndex: number;
  explanationOfAnswer: string;
}

interface SubCategory {
  id: string;
  title: string;
  topics: Topic[];
}

interface MainCategory {
  id: string;
  title: string;
  color: string;
  borderColor: string;
  glowColor: string;
  bgColor: string;
  subCategories: SubCategory[];
}

// -------------------------------------------------------------
// CONCISE, HIGH-VALUE FTC ROBOTICS LEARNING PATHWAY DATA DATA
// -------------------------------------------------------------
const FTC_KNOWLEDGE_PATH: MainCategory[] = [
  {
    id: 'beginner-foundations',
    title: 'Beginner: Foundations',
    color: 'from-emerald-600 to-emerald-400',
    borderColor: 'border-emerald-500/30',
    glowColor: 'shadow-emerald-500/10',
    bgColor: 'bg-emerald-500/5',
    subCategories: [
      {
        id: 'team-management',
        title: 'Team & Management',
        topics: [
          {
            id: 'eng-notebook',
            title: 'Engineering Notebook Requirements',
            shortDesc: 'Chronological recording, team diaries, and design formatting benchmarks.',
            explanation: 'The Engineering Notebook is a daily historical log documenting your team\'s progress, layout considerations, and strategic decisions. It should be compiled sequentially after each practice session, detailing exactly WHO did WHAT, with visual attachments like labeled CAD screenshots and testing telemetry data charts.',
            practicalTip: 'Update your notebook immediately after a build, noting why a specific brace failed of fatigue.',
            quizQuestion: 'What is the primary purpose of the Engineering Notebook in a FIRST tournament?',
            quizOptions: [
              'A collection of random photos with no text description.',
              'A chronological record of design iterations, team meetings, failures, and outreach to demonstrate learning.',
              'An informal text chat between team members kept private.',
              'A list of parts ordered from suppliers with receipts.'
            ],
            correctOptionIndex: 1,
            explanationOfAnswer: 'Judges use the Engineering notebook to verify the depth of the team’s design thinking, chronological prototyping steps, and organizational sustainability.'
          },
          {
            id: 'design-process',
            title: 'Engineering Design Process',
            shortDesc: 'Prototyping, testing, and refining your mechanisms iteratively.',
            explanation: 'The Engineering Design Process follows a critical cycle: Identify the Problem -> Research -> Brainstorm solutions -> Prototype -> Test -> Refine the design. Every mechanical fix or software configuration on Team Vortex must document this cycle, proving technical decisions are backed by testing, not guesswork.',
            practicalTip: 'Prototype intakes using cardboard and LEGO motors before routing custom carbon fiber sheets.',
            quizQuestion: 'In the design process, what step should immediately follow brainstorming concepts?',
            quizOptions: [
              'Constructing a final, heavy-duty tournament chassis.',
              'Filing a corporate sponsorship query.',
              'Rapid prototyping of lightweight scale concepts to test physical viability.',
              'Skipping testing to immediately assemble code.'
            ],
            correctOptionIndex: 2,
            explanationOfAnswer: 'Prototyping lets you verify spatial claims, physical friction, and mechanical gear sizes with minimal time and financial cost.'
          },
          {
            id: 'team-outreach',
            title: 'Team Outreach & Strategic Plans',
            shortDesc: 'Capital fundraising, corporate sponsor pitches, and mentoring rookie clubs.',
            explanation: 'FTC Teams operate as miniature research and development startups. Elite teams formulate clear Strategic Business Plans to secure corporate sponsorships from engineering giants. They also engage in STEM outreach, sharing robotics knowledge with underrepresented schools to grow FIRST.',
            practicalTip: 'Prepare a 1-page visual executive summary to pitch directly to local technology businesses.',
            quizQuestion: 'What defines a strong strategic outreach campaign for FTC teams?',
            quizOptions: [
              'A campaign that keeps all robot blueprints locked away.',
              'Actively sharing code libraries, conducting STEM workshops, and forming corporate advisory mentorships.',
              'Generating spam emails to random corporations.',
              'Competing in matches without discussing anything with opponents.'
            ],
            correctOptionIndex: 1,
            explanationOfAnswer: 'Outreach is evaluated on reciprocal learning, community impact, and establishing robust local technical mentorships.'
          },
          {
            id: 'core-values',
            title: 'Core Values & Gracious Professionalism',
            shortDesc: 'Fierce competition balanced with community cooperation in the pit.',
            explanation: 'Coined by Dr. Woodie Flowers, Gracious Professionalism represents respect, community unity, and high-quality craftsmanship. It teaches that helping your opponent succeed makes the entire competition stronger, celebrating collective human capability.',
            practicalTip: 'Share code examples and spare control modules with struggling alliance teams.',
            quizQuestion: 'What does "Coopertition" represent in a FIRST event?',
            quizOptions: [
              'Refusing to loan replacement parts to direct competitors.',
              'Cooperating and assisting competing teams even under tight qualifying pressure.',
              'Merging two matching robotic chassis on the field.',
              'Intentionally losing a match to earn friend credit points.'
            ],
            correctOptionIndex: 1,
            explanationOfAnswer: 'Coopertition is built on the belief that mutual gain is far more valuable than winning against a crippled rival.'
          }
        ]
      },
      {
        id: 'hardware-basics',
        title: 'Hardware Basics',
        topics: [
          {
            id: 'starter-kits',
            title: 'Starter Kits (REV/goBILDA)',
            shortDesc: 'Understanding standard channel patterns, metric hubs, and planetary motors.',
            explanation: 'FTC builds are generally anchored around structural grid kits. goBILDA uses an 8mm grid pattern with metric channels and clamping hubs, while REV Robotics uses extrusion slots with brackets. Clamping collars, D-shafts, and dual-bearing supports ensure robust rotating assemblies.',
            practicalTip: 'Always use dual-bearing supports on load-bearing axles to eliminate shaft bending stresses.',
            quizQuestion: 'Why are clamping hubs preferred over set screws for fastening gears to drive axles?',
            quizOptions: [
              'Set screws slip on D-profile shafts and mar the metal under load, while clamping hubs distribute torque concentrically.',
              'Clamping hubs are lighter and cheaper.',
              'Set screws are illegal under FTC hardware rules.',
              'Clamping hubs require custom tools for assembly.'
            ],
            correctOptionIndex: 0,
            explanationOfAnswer: 'Clamping hubs squeeze around the entire circumference of the shaft, ensuring flawless concentric grip and zero slippage.'
          },
          {
            id: 'structural-parts',
            title: 'Structural Parts (Channels & Screws)',
            shortDesc: 'U-Channels, corner brackets, cross-supports, and structural load distribution.',
            explanation: 'Robots experience violent collisions on the field. Building a rigid frame requires U-Channels made from anodized aluminum reinforced with high-tensile steel screws. Triangulating structural rails with corner braces ensures the frame does not skew under stress.',
            practicalTip: 'Ensure a rigid rectangular frame: measure diagonals to confirm they are identical before tightening bolts.',
            quizQuestion: 'What structural geometry is most resilient to diagonal torque and warping forces?',
            quizOptions: [
              'A standard cantilevered single-point frame rail.',
              'A triangulated structural network utilizing cross-bracing and corner plates.',
              'Double-sided adhesive adhesive mounting tape sheets.',
              'Thin, non-reinforced plastic guide tracks.'
            ],
            correctOptionIndex: 1,
            explanationOfAnswer: 'Triangulation restricts rotational degrees of freedom, locking structural bars and distributing mechanical shear loads evenly.'
          },
          {
            id: 'actuators',
            title: 'Actuators (DC Motors & Servos)',
            shortDesc: 'Comparing planetary gearbox speeds, motor torque curves, and servo travel.',
            explanation: 'DC Motors convert electrical energy from battery packs into rotational kinetic torque. Planetary gearboxes reduce motor RPM to trade speed for high lifting power. Servos use closed-loop feedback internally to drive shafts to specific angles or run continuously with speed control.',
            practicalTip: 'Configure standard 19.2:1 motors for drivetrains, and 50.9:1 or higher for linear cable lifts.',
            quizQuestion: 'If you swap a 19.2:1 motor for a 50.9:1 planetary motor, what will happen to the output shaft?',
            quizOptions: [
              'Rotational speed increases, and torque output decreases.',
              'Rotational speed decreases, and torque output increases significantly.',
              'Both torque and speed will increase at the same rate.',
              'The motor will run directly on AC current.'
            ],
            correctOptionIndex: 1,
            explanationOfAnswer: 'Increasing the gear ratio trades rotational velocity for a massive mechanical torque boost, perfect for lifting heavy mechanisms.'
          },
          {
            id: 'simple-drivetrains',
            title: 'Simple Drivetrains (Tank & Arcade)',
            shortDesc: 'Dual-drive and direct gear configurations for differential drivetrains.',
            explanation: 'A differential drive chassis utilizes left and right wheel banks. Turning is achieved by running the sides in opposite directions. Arcade drive maps single-joystick vertical inputs to forward/back motion, and horizontal inputs to steering variables, optimizing driver accessibility.',
            practicalTip: 'Run chain or timing belts inside the structural channel walls to protect them from field debris.',
            quizQuestion: 'How does a tank drive robot rotate 360 degrees on its central axis?',
            quizOptions: [
              'By spinning both the left and right wheel banks forward at matching rates.',
              'By locking both sides while enabling independent steering linkages.',
              'By driving the left side forward and the right side in reverse at matching speeds.',
              'By raising the chassis using active linear slides.'
            ],
            correctOptionIndex: 2,
            explanationOfAnswer: 'Counter-rotating side motors creates equal and opposite force vectors on the floor, spinning the robot on its coordinate center.'
          }
        ]
      },
      {
        id: 'software-entry',
        title: 'Software Entry',
        topics: [
          {
            id: 'ftc-blocks',
            title: 'FTC Blocks Programming',
            shortDesc: 'Drag-and-drop block coding, action statements, and loop controls.',
            explanation: 'FTC Blocks is a graphical, drag-and-drop IDE that compiles to Java under the hood. It allows apprentice developers to instantly map game controllers, adjust motor powers, set speeds, and read sensors without syntax overhead.',
            practicalTip: 'Use Blocks to write prototype drive loops swiftly, then use OnBot to adapt it into true Java classes.',
            quizQuestion: 'What occurs when you hook an unconfigured motor name inside FTC Blocks?',
            quizOptions: [
              'The robot will guess the port dynamically.',
              'The blocks IDE will throw a syntax error on deployment due to unmatched hardware mapping.',
              'The control hub will play an alarm noise.',
              'The motor will run at full power indefinitely.'
            ],
            correctOptionIndex: 1,
            explanationOfAnswer: 'All active hardware ports must be configured in active XML setup lists matching your software definitions.'
          },
          {
            id: 'onbot-setup',
            title: 'OnBot Java Setup',
            shortDesc: 'Local server compiling, wireless configuration, and active file setups.',
            explanation: 'OnBot Java is an interface hosted directly on the REV Control Hub. Developers connect via local Wi-Fi, write true Java classes directly in their browser, and compile codes synchronously onto the robot without installing external heavy compilers.',
            practicalTip: 'Backup your code files regularly by downloading them from the OnBot interface to a USB stick.',
            quizQuestion: 'How does OnBot Java connect your computer directly to the robot?',
            quizOptions: [
              'Via a local Wi-Fi connection hosted directly by the REV Control Hub.',
              'Through a public global cloud portal.',
              'Using Bluetooth audio links only.',
              'By plugging the controller directly into your house router.'
            ],
            correctOptionIndex: 0,
            explanationOfAnswer: 'The Control Hub runs a local web server over a secure Wi-Fi Direct network, enabling in-browser coding and wireless compilation.'
          },
          {
            id: 'custom-blocks',
            title: 'Custom Blocks (myBlocks)',
            shortDesc: 'Creating custom modular blocks to package repeated logic patterns.',
            explanation: 'To keep block code clean, developers utilize "myBlocks". These are user-defined modules that encapsulate complex logic blocks (like encoder calculations) into a single dragable widget, keeping top-level loops extremely readable.',
            practicalTip: 'Create a "DriveDistance" myBlock with parameters for inches and power to reuse in autonomous runs.',
            quizQuestion: 'What is the primary architectural benefit of creating custom "myBlocks"?',
            quizOptions: [
              'It makes the robot move significantly faster on the field.',
              'It promotes code reuse, modularity, and clutter reduction inside visual block files.',
              'It allows you to bypass hardware configurations entirely.',
              'It translates block programs into HTML design files.'
            ],
            correctOptionIndex: 1,
            explanationOfAnswer: 'Encapsulating complex blocks keeps the program modular, making debugging far easier for the entire team.'
          },
          {
            id: 'hardware-config',
            title: 'Hardware Configuration & Telemetry',
            shortDesc: 'Mapping electronic ports in standard XML setups and logging data to driver station phone screens.',
            explanation: 'Every motor, servo, and sensor must have its hardware name declared in standard XML profiles on the controller. In code, `telemetry.addData()` prints operational strings, encoder counts, and diagnostic numbers to the driver station.',
            practicalTip: 'Format telemetry outputs cleanly: print battery voltage and motor temperature in main loop headers.',
            quizQuestion: 'What command handles printing sensor values to the driver station dashboard?',
            quizOptions: [
              'System.out.println()',
              'telemetry.addData() and telemetry.update()',
              'hardwareMap.addValue()',
              'sensorPort.log()'
            ],
            correctOptionIndex: 1,
            explanationOfAnswer: '`telemetry.addData(key, value)` queue-logs the data, and `telemetry.update()` pushes and renders the active list onto the driver station screen.'
          }
        ]
      }
    ]
  },
  {
    id: 'intermediate-systems',
    title: 'Intermediate: System Integration',
    color: 'from-cyan-600 to-cyan-400',
    borderColor: 'border-cyan-500/30',
    glowColor: 'shadow-cyan-500/10',
    bgColor: 'bg-cyan-500/5',
    subCategories: [
      {
        id: 'java-programming',
        title: 'Java Programming',
        topics: [
          {
            id: 'opmode-compare',
            title: 'LinearOpMode vs Iterative OpMode',
            shortDesc: 'Threads vs callback loops: structural blocks of FTC robot operations.',
            explanation: 'A `LinearOpMode` is thread-based: code executes within a single `runOpMode()` method, using `waitForStart()` to block, followed by sequential loops. An iterative `OpMode` maps lifecycle triggers to continuous callbacks: `init()`, `init_loop()`, `start()`, `loop()`, and `stop()`. It never blocks the thread, making multi-tasking easier.',
            practicalTip: 'Use Iterative OpMode for complex state machines, and LinearOpMode for straightforward autonomous runs.',
            quizQuestion: 'Why must you avoid using Thread.sleep() inside an iterative OpMode loop() method?',
            quizOptions: [
              'It works fine and has no side effects.',
              'It freezes the main thread, blocking hardware updates and failing loop safety frequency requirements.',
              'It automatically shuts down the battery pack.',
              'It shifts motor directions in reverse.'
            ],
            correctOptionIndex: 1,
            explanationOfAnswer: '`loop()` runs sequentially in iterative setups. Freezing it blocks motor communications and watchdog checks, crashing the session.'
          },
          {
            id: 'primitive-types',
            title: 'Primitive Types & Variables',
            shortDesc: 'Double joystick values, integer ticks, and boolean limit-switch values.',
            explanation: 'In Java programming, selecting appropriate variable types is core to memory safety. Analog stick values range from -1.0 to 1.0 (doubles), rotation counts are precise steps (integers), and sensor states are active/inactive flags (booleans).',
            practicalTip: 'Initialize joystick readings directly in local loop scopes to refresh input states instantly.',
            quizQuestion: 'Which variable primitive type should represent motor joystick inputs?',
            quizOptions: [
              'int',
              'boolean',
              'double',
              'char'
            ],
            correctOptionIndex: 2,
            explanationOfAnswer: 'Joystick axis values return fine fractional degrees, requiring decimal fields (double or float) for analogue movement mapping.'
          },
          {
            id: 'class-structure',
            title: 'Class Structure & Inheritance',
            shortDesc: 'Writing clean Java classes for modular assemblies (intakes, lifts, arms).',
            explanation: 'Object-Oriented Programming (OOP) makes managing complex robots clean. Creating distinct class modules (like `class Intake` or `class LinearSlide`) isolates raw motor commands inside subsystem boundaries, exposing simple actions to the drive file.',
            practicalTip: 'Implement a `setHeight(double position)` helper within slides rather than updating motor targets in main loops.',
            quizQuestion: 'What is the primary OOP benefit of creating an independent "Subsystem" class?',
            quizOptions: [
              'It makes the battery last longer.',
              'It isolates mechanism-specific logic, meaning if your slide breaks, you edit one file without breaking drivetrain codes.',
              'It bypasses hardware configurations.',
              'It allows motors to run on AC power.'
            ],
            correctOptionIndex: 1,
            explanationOfAnswer: 'Isolating hardware codes inside subsystem classes decouples complex layouts from match files, preventing bug regressions.'
          },
          {
            id: 'hardware-mapping',
            title: 'Robot Hardware Mapping',
            shortDesc: 'Locating hardware devices at init using hardwareMap.get().',
            explanation: 'Before writing speed updates to a motor, your software must fetch its reference from the control hub. In Java, this is resolved via: `leftDrive = hardwareMap.get(DcMotor.class, "left_drive");`, matching the physical XML configuration name.',
            practicalTip: 'Always name motors in lower_camelCase inside XML files for easy coding compatibility.',
            quizQuestion: 'What does hardwareMap.get() perform inside an OpMode?',
            quizOptions: [
              'It adjusts motor power levels.',
              'It compiles code.',
              'It queries the REV Control Hub for the physical device matching the XML string configuration and links it to our code object.',
              'It is used to check battery voltage.'
            ],
            correctOptionIndex: 2,
            explanationOfAnswer: 'This resolves the driver hub mapping link, establishing communication between software commands and physical electronic ports.'
          }
        ]
      },
      {
        id: 'mechanism-design',
        title: 'Mechanism Design',
        topics: [
          {
            id: 'active-intake',
            title: 'Active Intake Principles',
            shortDesc: 'Designing rotating sweeps, compliance roller grip, and friction geometry.',
            explanation: 'An active intake pulls game pieces into the chassis. By utilizing flexible silicone or compliance rubber rollers spinning inwards, the collector establishes positive traction. Rollers compress and pull pixels effortlessly without stalling motors.',
            practicalTip: 'Select 2-inch compliance wheels with 35A (softer) durometer for optimal compression grip.',
            quizQuestion: 'Why is a soft durometer (e.g., 35A) rubber intake roller preferred over hard plastic?',
            quizOptions: [
              'Soft rubber compresses around game piece variations, establishing elastic traction without crushing fragile parts.',
              'It is cheaper.',
              'Hard plastic causes electronic shorts.',
              'It does not require bearings.'
            ],
            correctOptionIndex: 0,
            explanationOfAnswer: 'Softer wheels bend around complex shapes, expanding surface contact area to maintain continuous intake friction.'
          },
          {
            id: 'linear-slides',
            title: 'Linear Slides & Rigging',
            shortDesc: 'Comparing continuous vs cascade string paths for vertical lifts.',
            explanation: 'Linear slides use overlapping rails and ball bearings to telescope. In a continuous rig, string feeds through all pulleys continuously. Cascade rigging routes individual ropes per section, lifting all stages simultaneously and faster, though requiring dual-tension tuning.',
            practicalTip: 'Use dyneema string; standard nylon stretches under heavy load, causing lift coordinates to sag.',
            quizQuestion: 'What is a major mechanical advantage of Cascade rigging over Continuous rigging?',
            quizOptions: [
              'It uses fewer pulleys and string.',
              'All stages lift at matching rates, keeping movement fast and cable paths perfectly proportional.',
              'It requires zero motor torque to lift.',
              'It operates entirely without bearings.'
            ],
            correctOptionIndex: 1,
            explanationOfAnswer: 'Cascade stages expand simultaneously. The speed ratio is multiplied by the number of stages, making lift responses extremely snappy.'
          },
          {
            id: 'mecanum-math',
            title: 'Mecanum Drive Vector Math',
            shortDesc: 'Converting 2D coordinates into 4-wheel velocity motors.',
            explanation: 'Mecanum wheels have specialized rollers angled at 45 degrees. By setting unique spinning vectors per wheel, forces cancel and combine to drive diagonally, translate sideways, or spin. Calculations use trigonometric formulas: `v_LF = y + x + r`, `v_RF = y - x - r`, etc.',
            practicalTip: 'Reverse right-side motor directions in code to keep forward vectors matching.',
            quizQuestion: 'Under standard Mecanum formulations, how do you make the robot translate horizontally left (strafe)?',
            quizOptions: [
              'All four wheels spinning forward at matching rates.',
              'Front motors outward, rear motors inward: LF and RR reverse, RF and LR forward.',
              'Spinning both left wheels forward, right wheels reverse.',
              'Reversing only front-left and front-right.'
            ],
            correctOptionIndex: 1,
            explanationOfAnswer: 'Opposite rotational pairings cancel forward force components while adding lateral thrust, pulling the robot perfectly sideways.'
          },
          {
            id: 'centric-control',
            title: 'Robot-Centric vs Field-Centric Control',
            shortDesc: 'Using IMU heading angles to keep controls lined up with the driver.',
            explanation: 'Robot-centric driving maps "forward" to the robot\'s nose. Field-centric utilizes the IMU Gyro yaw reading to rotate game pad vectors. This maps joystick "up" to field "north", regardless of which way the chassis nose is pointing.',
            practicalTip: 'Implement field-centric control to let drivers maneuver around obstacles easily without mental rotation.',
            quizQuestion: 'Which mathematical transformation implements Field-Centric control?',
            quizOptions: [
              'Adding battery voltage directly to joystick power.',
              'Rotating gamepad coordinates (x, y) by the negative IMU yaw angle using trigonometry.',
              'Turning off motor encoders altogether.',
              'Multiplying all output powers by 0.5.'
            ],
            correctOptionIndex: 1,
            explanationOfAnswer: 'Applying a 2D rotation matrix using the gyro’s heading angle aligns the gamepad joystick axes with the grid lines of the field.'
          }
        ]
      },
      {
        id: 'core-software',
        title: 'Core Software Concepts',
        topics: [
          {
            id: 'state-machines',
            title: 'Finite State Machines (FSMs)',
            shortDesc: 'Grouping automated movements into clean, sequential state steps.',
            explanation: 'Rather than blocking code loops, FSMs use enums (e.g. `IDLE`, `INTAKING`, `ELEVATING`, `SCORING`). The loop processes actions based on the current state, dynamically transitioning to the next state only when sensor conditions are satisfied.',
            practicalTip: 'Transition from `ELEVATE` to `SCORE` only when a distance sensor confirms linear slides have reached their target height.',
            quizQuestion: 'In a non-blocking FSM, how does the state transition from RAISE_LIFT to DEPOSIT?',
            quizOptions: [
              'By using a long sleep() block inside loop().',
              'By checking in loop() if the motor position is within tolerance, then updating the state variable to DEPOSIT.',
              'By restarting the robot controller.',
              'By turning off the drive joystick.'
            ],
            correctOptionIndex: 1,
            explanationOfAnswer: 'Enabling constant checking during the main loop lets subsystems update in real-time, firing clean state transitions without blocking execution.'
          },
          {
            id: 'sensors',
            title: 'Sensor Integration (Color, Distance, Touch)',
            shortDesc: 'I2C signal buses, digital signals, and limit threshold switches.',
            explanation: 'Sensors feed data into your code. Color sensors identify playing piece hue values over high-speed I2C connections, distance sensors measure laser signal flight-times (ToF), and magnetic touch switches map physical limit stop states.',
            practicalTip: 'Use a digital touch switch at the bottom of linear slides to reset your encoder counts to zero automatically on startup.',
            quizQuestion: 'What protocol do color and distance sensors usually use to send continuous data to the Control Hub?',
            quizOptions: [
              'Standard Analog lines',
              'I2C Serial Bus Protocol',
              'Raw high-voltage AC',
              'No connection (completely wireless)'
            ],
            correctOptionIndex: 1,
            explanationOfAnswer: 'I2C is an addressable multi-device digital bus, feeding coordinates and raw sensor values through four-wire ports.'
          },
          {
            id: 'encoders',
            title: 'Encoder Feedback & Bulk Reads',
            shortDesc: 'Rotational counts and bulk communication configs to increase loop speeds.',
            explanation: 'Encoders track motor rotation ticks. Reading multiple motor encoder registers individually over I2C slows down loop rates. Enabling Bulk Reads grabs all incoming hardware data from a expansion hub in one single bus communication, boosting loop frequencies.',
            practicalTip: 'Call `hub.setBulkCachingMode(BulkCachingMode.AUTO)` in initialization to instantly double your software frequency.',
            quizQuestion: 'Why are motor encoder bulk reads highly recommended for advanced autonomous runs?',
            quizOptions: [
              'They increase physical motor torque.',
              'They package multiple hardware I2C queries into a single data package, reducing latency and raising loop rates.',
              'They bypass the need for code compilation.',
              'They charge the battery dynamically on the field.'
            ],
            correctOptionIndex: 1,
            explanationOfAnswer: 'Single-thread queries bottleneck communication wires. Caching bulk registers in memory optimizes bus performance.'
          },
          {
            id: 'autonomous-strategy',
            title: 'Basic Autonomous Strategy',
            shortDesc: 'Spike mark detection, yellow pixel positioning, and navigation zoning.',
            explanation: 'Autonomous strategy covers actions within the first 30 seconds of play. Robots must read spike marks, deposit team pieces, navigate corridors, and park in scoring zones, requiring sensor checks and precise pathing.',
            practicalTip: 'Define reliable safe routes first, then optimize transit speeds and complex deposits.',
            quizQuestion: 'What is crucial when programming reliable initial autonomous routines?',
            quizOptions: [
              'Relying entirely on time-based motor runs without sensor corrections.',
              'Writing flexible modular paths, calibrating sensor triggers, and planning error-recovery steps.',
              'Running drive motors at full power for random intervals.',
              'Driving directly into opposing team robots.'
            ],
            correctOptionIndex: 1,
            explanationOfAnswer: 'Sensors and structured feedback protect autonomous pathways against battery decay, wheel spin, and physical impacts.'
          }
        ]
      }
    ]
  },
  {
    id: 'advanced-precision',
    title: 'Advanced: Precision & Automation',
    color: 'from-amber-650 to-amber-450',
    borderColor: 'border-amber-500/30',
    glowColor: 'shadow-amber-500/10',
    bgColor: 'bg-amber-500/5',
    subCategories: [
      {
        id: 'control-theory',
        title: 'Control Theory Basics',
        topics: [
          {
            id: 'open-closed-loop',
            title: 'Open Loop vs Closed Loop Control',
            shortDesc: 'Driving raw levels versus checking actual sensor results.',
            explanation: 'Open-loop control outputs power blindly (e.g. `setPower(0.5)`). Closed-loop control monitors error (target vs actual position) continuously using sensors to adjust power dynamically, correcting for drift or disturbances.',
            practicalTip: 'Always use closed-loop calculations for scoring and elevator extension targeting.',
            quizQuestion: 'What distinguishes a closed-loop system from an open-loop model?',
            quizOptions: [
              'Closed-loop systems do not require battery power.',
              'Closed-loop systems incorporate feedback sensors to measure system output and correct real-time target error.',
              'Closed-loop systems compile code significantly faster.',
              'Closed-loop systems are purely physical without coding.'
            ],
            correctOptionIndex: 1,
            explanationOfAnswer: 'Feedback loops calculate deviations and apply proactive corrections, keeping system targets steady.'
          },
          {
            id: 'pid-tuning',
            title: 'PID/PIDF Controller Tuning',
            shortDesc: 'Configuring Proportional, Integral, and Derivative gains.',
            explanation: 'A PID controller calculates error correction terms: Proportional (grows based on current error), Integral (resolves cumulative steady-state error), and Derivative (resolves rapid velocity changes to prevent overshooting).',
            practicalTip: 'Tune PID systems systematically: raise Kp until oscillation starts, then add Kd to settle, and Ki last.',
            quizQuestion: 'What coefficient dampens oscillations and prevents overshoot in a PID system?',
            quizOptions: [
              'Proportional (Kp)',
              'Integral (Ki)',
              'Derivative (Kd)',
              'Feedforward (Kf)'
            ],
            correctOptionIndex: 2,
            explanationOfAnswer: 'The Derivative term monitors change rates, acting as a brake when approaching targets to minimize overshoot.'
          },
          {
            id: 'feedforward',
            title: 'Feedforward Control',
            shortDesc: 'Cancelling static friction and gravity forces.',
            explanation: 'PID is reactive—it requires error to corrective action. Feedforward (F) is predictive—it calculates the power needed to balance gravity or overcome physical friction beforehand based on physical specifications: `Power = PID_Output + Kg`.',
            practicalTip: 'Add a constant lift offset (Kg) to slides to hold their height and counter gravity.',
            quizQuestion: 'Why is gravity feedforward (Kg) essential for structural slide lifts?',
            quizOptions: [
              'It turns motors on and off repeatedly.',
              'It provides constant holding power to cancel gravity, preventing slides from sinking without burning out integration limits.',
              'It increases maximum battery output.',
              'It makes coordinate mapping unnecessary.'
            ],
            correctOptionIndex: 1,
            explanationOfAnswer: 'By outputting the exact target power to balance gravity, your PID stays isolated, correcting actual positioning errors.'
          }
        ]
      },
      {
        id: 'localization',
        title: 'Localization & Pathing',
        topics: [
          {
            id: 'dead-wheel-odo',
            title: 'Dead Wheel Odometry Pods',
            shortDesc: 'Slippage-free coordinates with horizontal and vertical dead-direction encoders.',
            explanation: 'Drive wheels slip under active load, corrupting encoder track data. Odometry pods use free-spinning, spring-loaded wheels to record movement on the mat, tracking robot $x, y$ coordinates accurately.',
            practicalTip: 'Calibrate your encoder ticks-per-inch using a long straight physical ruler to verify accuracy.',
            quizQuestion: 'Why do dead-wheel odometry systems output more reliable field-position data than standard motor encoders?',
            quizOptions: [
              'They connect to faster serial ports.',
              'They are not powered, so they only roll with the surface—eliminating drivetrain slippage errors.',
              'They are heavier and stabilize the chassis.',
              'They output data in high-voltage analog formats.'
            ],
            correctOptionIndex: 1,
            explanationOfAnswer: 'Free from torque loads, dead-wheel pods roll purely with field tiles, tracking actual coordinates even during collisions.'
          },
          {
            id: 'imu-fusion',
            title: 'IMU Orientation Fusion',
            shortDesc: 'Integrating high-speed physical gyroscopes with encoder tracks to minimize yaw drift.',
            explanation: 'High-speed robot runs skew lateral coordinate frames. Fusing internal IMU gyroscopes with encoder wheels lets your coordinate engine recalibrate orientation heading readings dynamically, preventing angular drift errors.',
            practicalTip: 'Reset IMU variables when aligned against field walls inside autonomous runs for precision alignment.',
            quizQuestion: 'What does fusing gyroscope yaw data with dead wheels prevent during rapid runs?',
            quizOptions: [
              'Battery drainage.',
              'Rotational coordinate drift over time, which can throw off path navigation.',
              'Motor gearbox fatigue.',
              'Optical camera noise.'
            ],
            correctOptionIndex: 1,
            explanationOfAnswer: 'Fusing gyroscopic headings with rolling data keeps heading parameters aligned, maintaining rotational tracking accuracy.'
          },
          {
            id: 'apriltag-pose',
            title: 'AprilTag Metadata & Pose Estimation',
            shortDesc: 'Measuring real-time translation vectors using known marker IDs.',
            explanation: 'AprilTags are 2D fiducial markers placed around the field. Camera software outputs absolute translational ($X, Y, Z$) and rotational ($roll, pitch, yaw$) vectors by measuring the coordinate distortion of tag boundaries.',
            practicalTip: 'Calculate your camera offset values relative to the robot center to ensure tag detections translate to true center pose.',
            quizQuestion: 'What parameter provides tag identification and spatial tracking from a raw camera frames?',
            quizOptions: [
              'Color histogram values.',
              'Fiducial tag pixel geometry, which maps known tag dimensions to calculate translation vectors.',
              'High-frequency infrared beams.',
              'Dynamic frame rates.'
            ],
            correctOptionIndex: 1,
            explanationOfAnswer: 'Knowing physical tag dimensions ($x, y$ size) lets algorithms compute 3D perspective offsets relative to camera chips.'
          },
          {
            id: 'pedro-roadrunner',
            title: 'Introduction to Pathing libraries (Road Runner & Pedro)',
            shortDesc: 'Spline follower systems and coordinate localized path profiles.',
            explanation: 'Pathing libraries like Road Runner and Pedro Pathing implement mathematical movement curves (splines). They translate starting pose and goal coordinates into parametric instructions, guiding the robot smoothly to and from tasks.',
            practicalTip: 'Use Pedro Pathing for active tele-op coordinate alignment and collision correction.',
            quizQuestion: 'What are parametric Bezier splines preferred over straight-line stops?',
            quizOptions: [
              'Because splines maintain constant velocity trajectories, smoothing mechanical acceleration changes and drift.',
              'Because they are simpler to write by hand.',
              'Because they don\'t use encoders.',
              'Because they bypass the need for code compilation.'
            ],
            correctOptionIndex: 0,
            explanationOfAnswer: 'Smooth spline curves limit sudden rotational and translational velocity spikes, resolving trajectory deviations.'
          }
        ]
      },
      {
        id: 'vision-systems',
        title: 'Vision Systems',
        topics: [
          {
            id: 'tensorflow-detection',
            title: 'TensorFlow Lite Object Detection',
            shortDesc: 'Using neural network models to identify spike marker elements.',
            explanation: 'TensorFlow Lite runs compact neural networks on the Control Hub to classify robot game elements. This is used in the first 30 seconds to locate custom team props on tape lines.',
            practicalTip: 'Train models on many test frames with varied backgrounds for robust detection under tournament lighting.',
            quizQuestion: 'What determines TensorFlow Lite classification reliability under varying stadium spotlights?',
            quizOptions: [
              'The brand of motor gearboxes used.',
              'The pixel threshold level and the variety of lighting frames included in deep-model training.',
              'The battery voltage level.',
              'The thickness of metal chassis channels.'
            ],
            correctOptionIndex: 1,
            explanationOfAnswer: 'Ensuring your training data has varied exposure values and lighting angles hardens model weights against field variations.'
          },
          {
            id: 'vision-portal',
            title: 'VisionPortal API',
            shortDesc: 'Opening multiple camera streams and managing active threads.',
            explanation: 'VisionPortal is the official FTC library for camera management. It runs multiple vision streams (like AprilTags and TensorFlow) simultaneously on a single camera sensor, optimizing system memory.',
            practicalTip: 'Set camera frame resolution to $640 \times 480$ at $30\text{ fps}$ to keep Control Hub processor usage low.',
            quizQuestion: 'What is a major performance benefit of utilizing the VisionPortal API?',
            quizOptions: [
              'It raises motor speed output.',
              'It manages multiple vision tasks on a shared camera frame thread, avoiding processor bottlenecks.',
              'It reduces the weight of physical mounts.',
              'It is completely mechanical.'
            ],
            correctOptionIndex: 1,
            explanationOfAnswer: 'VisionPortal pipes raw camera streams to varied processors simultaneously, minimizing redundant image requests.'
          },
          {
            id: 'opencv-integration',
            title: 'EasyOpenCV Integration',
            shortDesc: 'Using custom HSV and YCrCb color threshold channels.',
            explanation: 'EasyOpenCV leverages C++ compiled OpenCV libraries directly in Java. It allows you to convert images to HSV or YCrCb color spaces, apply color masks, and count pixels within targeted boxes to locate game pieces quickly.',
            practicalTip: 'Use YCrCb color channels to keep your color detection robust against glare from stadium lights.',
            quizQuestion: 'Why is the HSV (or YCrCb) color space preferred over RGB for color thresholding?',
            quizOptions: [
              'RGB frames consume too much memory.',
              'HSV isolates brightness (V) from color channels (H, S), making detection robust against changing lighting shadows.',
              'RGB filters are illegal under FTC guidelines.',
              'HSV only supports grayscale analysis.'
            ],
            correctOptionIndex: 1,
            explanationOfAnswer: 'By separating color saturation from brightness information, you can threshold for specific colors under both dim and bright conditions.'
          }
        ]
      }
    ]
  },
  {
    id: 'expert-optimization',
    title: 'Expert: Optimization & Control',
    color: 'from-violet-600 to-indigo-500',
    borderColor: 'border-violet-500/30',
    glowColor: 'shadow-violet-500/10',
    bgColor: 'bg-violet-500/5',
    subCategories: [
      {
        id: 'adv-control',
        title: 'Advanced Control Systems',
        topics: [
          {
            id: 'motion-profiling',
            title: 'Motion Profiling & Trajectories',
            shortDesc: 'Calculated trapezoidal speeds and S-curve progression rules.',
            explanation: 'PID tries to close step-errors immediately, causing massive current spikes and drivetrain slip. Motion Profiling calculates a smooth velocity curve (trapezoidal or S-curve) based on max acceleration and speed limits, guiding the system smoothly.',
            practicalTip: 'Write a trapezoidal profile generator to control arm rotation; it eliminates gear lash and motor wear.',
            quizQuestion: 'Why is motion profiling highly recommended over direct PID step commands?',
            quizOptions: [
              'It allows motors to bypass hardware drivers.',
              'It limits structural acceleration rates, reducing slip, mechanical judder, and gear train wear during fast runs.',
              'It charges battery cells dynamically.',
              'It only works with analog sensors.'
            ],
            correctOptionIndex: 1,
            explanationOfAnswer: 'Adhering to real acceleration limits keeps physical loads manageable, dampening mechanical vibrations.'
          },
          {
            id: 'kalman-filters',
            title: 'Kalman Filters & State Estimation',
            shortDesc: 'Fusing noisy sensor feeds to calculate true robot coordinates.',
            explanation: 'Sensors contain measurement noise. A Kalman Filter predicts the next state using physical formulas (like heading velocity) and updates its prediction using sensor inputs, weighing both mathematically to calculate the most probable true position.',
            practicalTip: 'Implement a Kalman Filter to fuse rapid odometry calculations with absolute, low-frequency camera AprilTag poses.',
            quizQuestion: 'How does a Kalman Filter determine the true state of a robot given noisy inputs?',
            quizOptions: [
              'By averaging all historical data with equal weight.',
              'By calculating optimal weights based on coordinate covariance and noise metrics to predict the true path.',
              'By locking the values to the first measurement.',
              'By shutting down noisy sensors.'
            ],
            correctOptionIndex: 1,
            explanationOfAnswer: 'It balances uncertainty between physical models and actual sensor measurements, calculating true position coordinates.'
          },
          {
            id: 'full-state',
            title: 'Full State Feedback',
            shortDesc: 'Multi-variable control systems regulating complex robot systems simultaneously.',
            explanation: 'Unlike single-input systems, Full State Feedback tracks all system variables (e.g. lift height, arm angle, and speed) simultaneously. Using State-Space representations and pole placement ensures the entire robot balances as a unified physical system.',
            practicalTip: 'Use State-Space models when balancing an arm where the load changes based on extension length.',
            quizQuestion: 'What distinguishes State-Space Full State Feedback from independent PID control loops?',
            quizOptions: [
              'It uses fewer feedback sensors.',
              'It tracks and controls multiple variables in a unified matrix system, managing cross-coupling physical forces.',
              'It only applies to differential drivetrains.',
              'It requires raw analog batteries.'
            ],
            correctOptionIndex: 1,
            explanationOfAnswer: 'By mapping variables into state vectors, your system accounts for physical interactions, stabilizing complex multi-joint mechanisms.'
          }
        ]
      },
      {
        id: 'sophisticated-nav',
        title: 'Sophisticated Navigation',
        topics: [
          {
            id: 'bezier-generation',
            title: 'Bezier Curve Path Generation',
            shortDesc: 'Mathematical spline coordinates and directional velocity vectors.',
            explanation: 'Path planners generate parametric Bezier curves using control handles. Position is calculated dynamically as a function of travel progress ($t$ from 0 to 1), providing continuous coordinates and curves for smooth motion.',
            practicalTip: 'Scale heading speeds near tight curves to prevent centripetal forces from washing out your path.',
            quizQuestion: 'In Bezier splines, what do control handle coordinates determine?',
            quizOptions: [
              'The height of the physical intake mechanism.',
              'The shape, tangency, and acceleration contours of the robotic transit path.',
              'The absolute compile speed of the Java program.',
              'The gear ratio of planetary motors.'
            ],
            correctOptionIndex: 1,
            explanationOfAnswer: 'Control point coordinates shape the bezier path, defining the tangent vectors and curvature profiles of your run.'
          },
          {
            id: 'global-localization',
            title: 'AprilTag Global Field Localization',
            shortDesc: 'Overriding cumulative odometry drift with absolute world tags.',
            explanation: 'Odometry dead wheels build up drift from tile squish and minute sliding. By locating a known tag, we calculate the robot\'s absolute field position, overriding the estimated odometry pose to reset tracking drift.',
            practicalTip: 'Update your odometry position when within 36 inches of a tag to keep localization accurate.',
            quizQuestion: 'What is the utility of merging camera tag detections with continuous dead wheel odometry tracking?',
            quizOptions: [
              'It increases motor RPM output.',
              'Odometry provides fast local tracking, while AprilTags periodically clear accumulated positioning drift.',
              'It permits the robot to bypass inspection rules.',
              'It shifts motor directions.'
            ],
            correctOptionIndex: 1,
            explanationOfAnswer: 'Odometry logs movements at high speed ($>100\text{Hz}$), while camera tags provide absolute, drift-free anchor points to keep pathing centered.'
          },
          {
            id: 'otos-integration',
            title: 'SparkFun OTOS Integration',
            shortDesc: 'Direct optical tracking sensors with internal yaw gyrocopes.',
            explanation: 'The SparkFun Optical Tracking Odometry Sensor (OTOS) uses a downward-facing camera to track floor tile patterns. Combined with an internal 6-axis IMU, it handles full localization math on its own chip, offloading calculations from the Control Hub.',
            practicalTip: 'Mount the OTOS exactly 10mm from the floor tile surface for optimal sensor focus and tracking.',
            quizQuestion: 'What performance boost does the SparkFun OTOS provide over standard dead wheels?',
            quizOptions: [
              'It runs entirely without electrical power.',
              'It tracks positions optically over I2C, eliminating mechanical wheel bounce, cable tensioning issues, and space constraints.',
              'It increases chassis structural rigidity.',
              'It allows you to bypass the need for code compilation.'
            ],
            correctOptionIndex: 1,
            explanationOfAnswer: 'Optical sensors track without physical contact, avoiding mechanical drag, tension issues, and wheel bouncing.'
          }
        ]
      },
      {
        id: 'system-opt',
        title: 'System Optimization',
        topics: [
          {
            id: 'loop-minimization',
            title: 'Loop Time Minimization',
            shortDesc: 'Optimizing loops to reach sub-2ms frequencies for responsive control.',
            explanation: 'High loop latency ruins control loop feedback. Minimizing telemetry prints, caching motor writes, offloading vision code to separate threads, and using quick sensors reduces loop times down to sub-2ms, making PID controllers incredibly responsive.',
            practicalTip: 'Disable all non-essential print statements inside driver-station updates to prevent thread delays.',
            quizQuestion: 'How does high loop latency ($>20\\text{ms}$) affect a fast-moving robot\'s PID response?',
            quizOptions: [
              'It has no effect on control stability.',
              'It introduces feedback time delay, causing violent overshoot, oscillation, and control instability.',
              'It makes the motor output gear shift in reverse.',
              'It instantly discharges the battery.'
            ],
            correctOptionIndex: 1,
            explanationOfAnswer: 'Delayed loop reads mean corrections are calculated using stale values, causing actuators to over-correct and oscillate.'
          },
          {
            id: 'write-caching',
            title: 'Motor Write Caching',
            shortDesc: 'Caching repeated motor power updates to eliminate I2C bus bottlenecks.',
            explanation: 'Writing identical speed values to a motor repeatedly floods the I2C bus with redundant commands. Motor write caching intercepts commands, only sending updates across the bus when target powers actually change.',
            practicalTip: 'Use class wrapper methods to filter and block redundant `setPower()` updates.',
            quizQuestion: 'What system bottleneck does motor write caching directly resolve?',
            quizOptions: [
              'Mechanical wear and tear on wheel shafts.',
              'Excessive I2C bus communications, giving the main controller thread more bandwidth to raise loop speeds.',
              'Low wireless compile speeds.',
              'High battery temperatures.'
            ],
            correctOptionIndex: 1,
            explanationOfAnswer: 'Restricting bus writes to actual command changes reduces communication overhead, freeing up crucial loop time.'
          },
          {
            id: 'opencv-processors',
            title: 'Custom OpenCV Pipelines (VisionProcessors)',
            shortDesc: 'Writing modular frame-processing code to keep camera frame rates fluid.',
            explanation: 'In the modern SDK, `VisionProcessor` isolates image operations into independent modules. It processes video frames on separate camera threads, keeping custom OpenCV operations from slowing down the robot\'s drive thread.',
            practicalTip: 'Keep your `processFrame` operations light; use crop regions to process only essential portions of the image.',
            quizQuestion: 'What is a major architecture benefit of using the modern VisionProcessor interface?',
            quizOptions: [
              'It renders three-dimensional CAD structures directly.',
              'It isolates vision tracking into a secondary thread, preventing camera frame analysis from slowing down your main driving loop.',
              'It extends operational sensor dimensions.',
              'It requires no coding.'
            ],
            correctOptionIndex: 1,
            explanationOfAnswer: 'Separating thread priorities ensures driving controls stay responsive, regardless of how complex your vision pipeline algorithms are.'
          }
        ]
      }
    ]
  }
];

// Helper to find parent category and subcategory of a topic
const findTopicMetadata = (topicId: string) => {
  for (const cat of FTC_KNOWLEDGE_PATH) {
    for (const sub of cat.subCategories) {
      const found = sub.topics.find(t => t.id === topicId);
      if (found) {
        return { cat, sub, topic: found };
      }
    }
  }
  return null;
};

// All consolidated flat topics list for easy lookup
const ALL_FLAT_TOPICS: Topic[] = FTC_KNOWLEDGE_PATH.reduce<Topic[]>((acc, cat) => {
  cat.subCategories.forEach(sub => {
    acc.push(...sub.topics);
  });
  return acc;
}, []);

export default function LearnTab() {
  type State = 'role_calibration' | 'pathway_hub' | 'topic_lab' | 'ai_generation';
  const [wizardState, setWizardState] = useState<State>('role_calibration');
  const [userRole, setUserRole] = useState<'student' | 'coach'>('student');
  const [userPace, setUserPace] = useState<'slow' | 'fast'>('fast');
  
  // Persistence State
  const [masteredTopics, setMasteredTopics] = useState<string[]>(() => {
    const saved = localStorage.getItem('ftc_mastered_topics');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [activeTopicId, setActiveTopicId] = useState<string>('');
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);

  // Quiz interactive variables
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [showAnswerFeedback, setShowAnswerFeedback] = useState<boolean>(false);

  // AI-custom custom lesson generator states
  const [customPromptText, setCustomPromptText] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiCustomLesson, setAiCustomLesson] = useState<any | null>(null);
  const [aiQuizAnswer, setAiQuizAnswer] = useState<number | null>(null);
  const [showAiFeedback, setShowAiFeedback] = useState(false);

  // Interactive Live Sim Parameters
  // Lab 1: Control Theory & Physics Sliders
  const [pidKp, setPidKp] = useState<number>(0.2);
  const [pidKi, setPidKi] = useState<number>(0.0);
  const [pidKd, setPidKd] = useState<number>(0.15);
  const [physicsTarget, setPhysicsTarget] = useState<number>(100);
  const [noiseLevel, setNoiseLevel] = useState<number>(10);
  const [massValue, setMassValue] = useState<number>(5);

  // Lab 2: Camera Vision Pipeline Sim Parameters
  const [cvPipelineFilter, setCvPipelineFilter] = useState<'raw' | 'hsv' | 'edge' | 'contour'>('raw');
  const [hsvHueMin, setHsvHueMin] = useState<number>(15);
  const [hsvSatMin, setHsvSatMin] = useState<number>(120);
  const [hsvValMin, setHsvValMin] = useState<number>(100);

  // Lab 3: Logic Loops & State Machine Elements
  const [fsmStages, setFsmStages] = useState<string[]>(['START_TELEOP', 'WAIT_PIXEL_ALIGN', 'OPEN_CLAW_AUTO', 'RELOAD_STATE']);
  const [fsmLoopActive, setFsmLoopActive] = useState<boolean>(false);
  const [fsmActiveIndex, setFsmActiveIndex] = useState<number>(0);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

  // Lab 4: Mechanical Assembly Calculators
  const [mechMassInput, setMechMassInput] = useState<number>(12); // lbs
  const [mechGearRatio, setMechGearRatio] = useState<number>(19.2); // x:1 reduction
  const [mechWinchRadius, setMechWinchRadius] = useState<number>(0.75); // inches
  const [mechSlideStages, setMechSlideStages] = useState<number>(2); // Stages count

  // Sync Mastered state to LocalStorage
  const markTopicAsMastered = (topicId: string) => {
    if (!masteredTopics.includes(topicId)) {
      const updated = [...masteredTopics, topicId];
      setMasteredTopics(updated);
      localStorage.setItem('ftc_mastered_topics', JSON.stringify(updated));
    }
  };

  const clearMasteredHistory = () => {
    if (window.confirm('Are you sure you want to reload progress? This will reset all your learned topics.')) {
      setMasteredTopics([]);
      localStorage.removeItem('ftc_mastered_topics');
    }
  };

  // State Machine Loop Simulation Interval
  useEffect(() => {
    let interval: any = null;
    if (fsmLoopActive) {
      interval = setInterval(() => {
        setFsmActiveIndex(prev => {
          const next = (prev + 1) % fsmStages.length;
          const stageName = fsmStages[next];
          const logPayloads = [
            `[TELEMETRY] FSM Loop active...`,
            `[` + new Date().toLocaleTimeString() + `] Changing active phase to -> ${stageName}`,
            `[HARDWARE] Encoder ticks count updated. Motor state matched.`,
            `[COMPASS] Gyroscope balance orientation verified at 0.12 degrees.`
          ];
          setTerminalLogs(logs => [logPayloads[next % logPayloads.length], ...logs.slice(0, 15)]);
          return next;
        });
      }, 1400);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [fsmLoopActive, fsmStages]);

  const selectNodeTopic = (topic: Topic) => {
    setActiveTopicId(topic.id);
    setActiveTopic(topic);
    setQuizAnswer(null);
    setShowAnswerFeedback(false);
    setWizardState('topic_lab');
  };

  // API Call: Custom AI Lesson generation
  const handleGenerateAiLesson = async () => {
    if (!customPromptText.trim()) return;
    setIsAiGenerating(true);
    setAiCustomLesson(null);
    setAiQuizAnswer(null);
    setShowAiFeedback(false);

    try {
      const response = await fetch('/api/generate-lesson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          topicInterest: customPromptText,
          pace: userPace,
          history: masteredTopics,
          role: userRole
        })
      });

      if (!response.ok) {
        throw new Error('Fallback target required');
      }

      const data = await response.json();
      setAiCustomLesson(data);
    } catch (err) {
      console.warn('AI Request failed, generating high-fidelity fallback', err);
      // Construct a highly descriptive local fallback object instantly!
      setAiCustomLesson({
        title: `Deep-Dive: ${customPromptText}`,
        explanation: `Custom study profile matching "${customPromptText}". Due to server response latency, this adaptive lesson reviews structural system interactions, testing tolerances under tournament vibrations, and coding constraints. Remember that in FTC engineering, mechanical stiffness must always accompany software logic to prevent slippage and drift on the tiles.`,
        practicalTip: `Always test ${customPromptText} with your driver simulator before writing permanent physical files to the Control Hub.`,
        quizQuestion: `What is the most secure mechanical strategy when implementing ${customPromptText}?`,
        quizOptions: [
          `Ensuring constant diagnostic telemetry checking and using rigid mounting brackets.`,
          `Increasing physical speed to full power without sensor feedback.`,
          `Relying entirely on time sleep() commands in sequential logs.`,
          `Removing the encoder communication cables altogether.`
        ],
        correctOptionIndex: 0,
        explanationOfAnswer: `Integrating feedback tracking with structurally rigid brackets safeguards mechanical movements, preventing alignment failures on match day.`
      });
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Master overall progress percent
  const overallProgressPercent = Math.min(100, Math.floor((masteredTopics.length / ALL_FLAT_TOPICS.length) * 100));

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto px-4 py-6" id="learning_lab_root">
      
      {/* HEADER TELEMETRY BOARD */}
      <div className="border border-[var(--border)] bg-[var(--card-bg)] rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-left">
        <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-emerald-500 via-cyan-500 via-amber-500 to-rose-500" />
        <div>
          <span className="text-[10px] font-mono font-black text-[var(--accent)] tracking-widest uppercase">FTC Adaptive Mastery Lab</span>
          <h2 className="text-2xl font-black uppercase text-[var(--text-primary)] mt-1 tracking-tight flex items-center gap-2">
            <Layout className="h-6 w-6 text-indigo-400" /> Robotics Knowledge Path Matrix
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-1 font-sans max-w-xl leading-relaxed">
            The ultimate visual mind map and adaptive simulator designed for Team Vortex members. Cancel out topics you already know to target exactly what you need to master.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 shrink-0">
          <div className="bg-[var(--bg-primary)]/80 border border-[var(--border)] rounded-xl px-4 py-2 text-left font-mono">
            <span className="text-[9px] text-[var(--text-secondary)] block uppercase font-bold">Lab Learning Pace</span>
            <span className="text-xs font-black text-amber-400 uppercase flex items-center gap-1.5 mt-0.5">
              <Clock className="h-3 w-5" /> {userPace === 'fast' ? '⚡ High-Speed' : '⚙️ Deliberate'}
            </span>
          </div>
          <div className="bg-[var(--bg-primary)]/80 border border-[var(--border)] rounded-xl px-4 py-2 text-left font-mono">
            <span className="text-[9px] text-[var(--text-secondary)] block uppercase font-bold">Calibration Role</span>
            <span className="text-xs font-black text-cyan-400 uppercase flex items-center gap-1.5 mt-0.5">
              <Compass className="h-3 w-5" /> {userRole === 'student' ? 'Competitive Student' : 'Team Coach'}
            </span>
          </div>
          <button
            onClick={() => setWizardState('role_calibration')}
            className="flex items-center gap-2 bg-indigo-600/25 border border-indigo-500/40 text-indigo-300 font-mono text-[10px] font-bold uppercase rounded-xl px-4 py-2.5 hover:bg-indigo-600/40 transition cursor-pointer"
          >
            <Settings className="h-4.5 w-4.5" /> Re-Calibrate
          </button>
        </div>
      </div>

      {/* OVERALL PROGRESS PANEL */}
      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-6 text-left relative overflow-hidden">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 text-indigo-400">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <span className="text-[9px] font-mono uppercase text-indigo-300 block">Path Mastery Progress</span>
            <div className="flex items-center gap-3 mt-1">
              <h3 className="text-xl font-black text-[var(--text-primary)] leading-none">{overallProgressPercent}%</h3>
              <span className="text-[10px] font-mono bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded font-bold uppercase">
                {masteredTopics.length} / {ALL_FLAT_TOPICS.length} MASTERED
              </span>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="flex-1 w-full max-w-lg">
          <div className="flex justify-between font-mono text-[9px] text-[var(--text-secondary)] mb-1 uppercase font-semibold">
            <span>Beginner</span>
            <span>Intermediate</span>
            <span>Advanced</span>
            <span>Expert</span>
          </div>
          <div className="w-full bg-[var(--bg-primary)] h-3.5 rounded-full p-0.5 border border-[var(--border)] relative overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-500 via-cyan-500 via-amber-500 to-indigo-500 h-full rounded-full transition-all duration-750 ease-out"
              style={{ width: `${overallProgressPercent}%` }}
            />
          </div>
        </div>

        <button
          onClick={clearMasteredHistory}
          className="font-mono text-[10px] text-rose-400 hover:text-rose-300 border border-rose-500/20 hover:border-rose-500/40 bg-rose-500/5 px-4 py-2 rounded-xl transition shrink-0 cursor-pointer uppercase"
        >
          Reset Path
        </button>
      </div>

      <AnimatePresence mode="wait">
        
        {/* STATE 1: SETUP CALIBRATION & CHECKLIST */}
        {wizardState === 'role_calibration' && (
          <motion.div
            key="role_calibration"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6 text-left"
          >
            {/* Setup inputs left */}
            <div className="md:col-span-5 bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6 flex flex-col gap-6">
              <div>
                <span className="text-[10px] font-mono font-black text-indigo-400 uppercase block">Step 01 / Path Calibration</span>
                <h3 className="text-lg font-black uppercase text-[var(--text-primary)] mt-1">Configure Your Learning Profile</h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed font-sans">
                  Choose your team role and learning speed. This alters the terminology depth and diagnostic questions generated recursively.
                </p>
              </div>

              {/* Input role */}
              <div className="flex flex-col gap-2.5">
                <label className="text-[10px] font-mono font-black uppercase tracking-wider text-[var(--text-secondary)]">Your Team Role</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setUserRole('student')}
                    className={`p-4 rounded-xl border text-left flex flex-col gap-1 transition ${
                      userRole === 'student'
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : 'border-[var(--border)] bg-[var(--bg-primary)]/40 hover:border-[var(--accent)]/30'
                    }`}
                  >
                    <Cpu className={`h-5 w-5 ${userRole === 'student' ? 'text-indigo-400' : 'text-[var(--text-secondary)]'}`} />
                    <span className="text-xs font-mono font-black uppercase tracking-tight text-[var(--text-primary)] mt-1">Student</span>
                    <span className="text-[9px] text-[var(--text-secondary)] leading-tight font-sans">Focuses on Java programming, hardware builds, and math kinematics.</span>
                  </button>
                  <button
                    onClick={() => setUserRole('coach')}
                    className={`p-4 rounded-xl border text-left flex flex-col gap-1 transition ${
                      userRole === 'coach'
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : 'border-[var(--border)] bg-[var(--bg-primary)]/40 hover:border-[var(--accent)]/30'
                    }`}
                  >
                    <Award className={`h-5 w-5 ${userRole === 'coach' ? 'text-indigo-400' : 'text-[var(--text-secondary)]'}`} />
                    <span className="text-xs font-mono font-black uppercase tracking-tight text-[var(--text-primary)] mt-1">Coach / Mentor</span>
                    <span className="text-[9px] text-[var(--text-secondary)] leading-tight font-sans">Focuses on business finance, game manuals, structural portfolios, and mentoring.</span>
                  </button>
                </div>
              </div>

              {/* Input pace */}
              <div className="flex flex-col gap-2.5">
                <label className="text-[10px] font-mono font-black uppercase tracking-wider text-[var(--text-secondary)]">Target Study Speed</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setUserPace('slow')}
                    className={`p-4 rounded-xl border text-left flex flex-col gap-1 transition ${
                      userPace === 'slow'
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : 'border-[var(--border)] bg-[var(--bg-primary)]/40 hover:border-[var(--accent)]/30'
                    }`}
                  >
                    <BookOpen className="h-5 w-5 text-[var(--text-secondary)]" />
                    <span className="text-xs font-mono font-black uppercase text-[var(--text-primary)] mt-1">Deliberate</span>
                    <span className="text-[9px] text-[var(--text-secondary)] font-sans">In-depth analogies and simple step-by-step challenges.</span>
                  </button>
                  <button
                    onClick={() => setUserPace('fast')}
                    className={`p-4 rounded-xl border text-left flex flex-col gap-1 transition ${
                      userPace === 'fast'
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : 'border-[var(--border)] bg-[var(--bg-primary)]/40 hover:border-[var(--accent)]/30'
                    }`}
                  >
                    <Zap className="h-5 w-5 text-indigo-400 animate-pulse" />
                    <span className="text-xs font-mono font-black uppercase text-[var(--text-primary)] mt-1">High-Speed</span>
                    <span className="text-[9px] text-[var(--text-secondary)] font-sans">Fast-track technical calculations and code matrices.</span>
                  </button>
                </div>
              </div>

              <button
                onClick={() => setWizardState('pathway_hub')}
                className="w-full mt-2 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-black tracking-wider uppercase rounded-xl shadow-lg transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                Ignite Custom Path <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Topic cancellation right */}
            <div className="md:col-span-7 bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6 flex flex-col gap-4">
              <div>
                <span className="text-[10px] font-mono font-black text-emerald-400 uppercase block">Offline Knowledge-Base Check</span>
                <h3 className="text-lg font-black uppercase text-[var(--text-primary)] mt-1">Do you already master any concepts?</h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1 font-sans">
                  Select key topics you already know thoroughly. They will be marked as **Canceled Out / Mastered** inside your core roadmap track, instantly unlocking advanced concepts downstream.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-2 custom-scrollbar">
                {ALL_FLAT_TOPICS.map((topic, index) => {
                  const isChecked = masteredTopics.includes(topic.id);
                  return (
                    <div
                      key={topic.id}
                      onClick={() => {
                        if (isChecked) {
                          const updated = masteredTopics.filter(t => t !== topic.id);
                          setMasteredTopics(updated);
                          localStorage.setItem('ftc_mastered_topics', JSON.stringify(updated));
                        } else {
                          markTopicAsMastered(topic.id);
                        }
                      }}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition select-none flex items-start gap-2.5 relative overflow-hidden ${
                        isChecked
                          ? 'border-emerald-500/55 bg-emerald-500/10'
                          : 'border-[var(--border)] bg-[var(--bg-primary)]/20 hover:border-indigo-500/40'
                      }`}
                    >
                      <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 ${isChecked ? 'border-emerald-500 bg-emerald-500' : 'border-[var(--border)]'}`}>
                        {isChecked && <CheckCircle className="h-3.5 w-3.5 text-black" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="block text-xs font-mono font-black uppercase tracking-tight text-[var(--text-primary)] truncate">
                          {topic.title}
                        </span>
                        <span className="block text-[9px] text-[var(--text-secondary)] leading-tight truncate">
                          {topic.shortDesc}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-[var(--border)] pt-4 mt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <span className="font-mono text-[10px] text-[var(--text-secondary)]">
                  ⚡ <strong className="text-emerald-400">{masteredTopics.length}</strong> topics fast-tracked
                </span>
                <button
                  onClick={() => setWizardState('pathway_hub')}
                  className="w-full sm:w-auto py-2.5 px-6 border-2 border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-black font-mono text-[11px] font-black uppercase rounded-xl transition cursor-pointer"
                >
                  Apply & Enter Path Map
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* STATE 2: THE INTERACTIVE VISUAL PATHWAYS TREE MAP */}
        {wizardState === 'pathway_hub' && (
          <motion.div
            key="pathway_hub"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex flex-col gap-6"
          >
            {/* Visual categories grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch">
              {FTC_KNOWLEDGE_PATH.map((category) => {
                const totalInCat = category.subCategories.reduce((sum, s) => sum + s.topics.length, 0);
                const masteredInCat = category.subCategories.reduce((sum, s) => {
                  return sum + s.topics.filter(t => masteredTopics.includes(t.id)).length;
                }, 0);
                const percentDone = totalInCat > 0 ? Math.floor((masteredInCat / totalInCat) * 100) : 0;

                return (
                  <div
                    key={category.id}
                    className={`border ${category.borderColor} bg-[var(--card-bg)] rounded-3xl p-5 flex flex-col justify-between gap-4 relative overflow-hidden transition hover:shadow-lg ${category.glowColor}`}
                  >
                    {/* Corner accent glow */}
                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${category.color} opacity-10 blur-xl`} />
                    <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
                    
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-mono bg-[var(--bg-primary)] border border-[var(--border)] px-2 py-0.5 rounded uppercase text-[var(--text-secondary)]">
                          Level Track
                        </span>
                        <span className="text-[10px] font-mono text-[var(--text-secondary)]">
                          {masteredInCat}/{totalInCat} Done
                        </span>
                      </div>
                      
                      <h3 className="text-sm font-black uppercase text-[var(--text-primary)] tracking-wide mt-3">
                        {category.title}
                      </h3>
                      
                      {/* Interactive visual loading line */}
                      <div className="w-full bg-[var(--bg-primary)] h-1.5 rounded-full overflow-hidden mt-2 border border-[var(--border)]">
                        <div 
                          className={`bg-gradient-to-r ${category.color} h-full rounded-full transition-all`}
                          style={{ width: `${percentDone}%` }}
                        />
                      </div>
                    </div>

                    {/* Subcategories & Nodes inside Category */}
                    <div className="flex flex-col gap-4 mt-2">
                      {category.subCategories.map((sub) => (
                        <div key={sub.id} className="text-left">
                          <span className="text-[9px] font-mono font-black text-indigo-300 uppercase tracking-widest block mb-1.5">
                            :: {sub.title}
                          </span>
                          
                          <div className="flex flex-col gap-1">
                            {sub.topics.map((topic) => {
                              const isMaxy = masteredTopics.includes(topic.id);
                              
                              return (
                                <div
                                  key={topic.id}
                                  onClick={() => selectNodeTopic(topic)}
                                  className={`p-2.5 rounded-lg border text-left transition text-[11px] cursor-pointer relative group flex items-center justify-between ${
                                    isMaxy
                                      ? 'border-emerald-500/25 bg-emerald-500/5 text-emerald-300 hover:bg-emerald-500/10'
                                      : 'border-[var(--border)] hover:border-indigo-500 hover:bg-indigo-600/5'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 min-w-0 pr-4">
                                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                      isMaxy ? 'bg-emerald-400' : 'bg-indigo-400 group-hover:scale-125'
                                    }`} />
                                    <span className="font-sans font-extrabold uppercase tracking-tight truncate text-[var(--text-primary)]">
                                      {topic.title}
                                    </span>
                                  </div>
                                  
                                  {isMaxy ? (
                                    <span className="text-[8px] font-mono text-emerald-400 font-bold tracking-wider shrink-0">✓ PASSED</span>
                                  ) : (
                                    <ChevronRight className="h-3 w-3 text-[var(--text-secondary)] opacity-40 group-hover:opacity-100 transition shrink-0" />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CORE INTERACTIVE LESSON GENERATION TOOL - OUTSIDE ROADMAP */}
            <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6 text-left relative overflow-hidden mt-4">
              <div className="absolute top-0 inset-y-0 right-0 w-1/3 bg-gradient-to-l from-indigo-500/5 to-transparent pointer-events-none" />
              <div className="flex items-center gap-2.5 mb-3">
                <Sparkles className="h-5 w-5 text-indigo-400 animate-pulse" />
                <h3 className="text-base font-black uppercase text-[var(--text-primary)]">Endless Curriculum Generator</h3>
              </div>
              <p className="text-xs text-[var(--text-secondary)] max-w-2xl leading-relaxed">
                Need to learn something outside the standard structural curriculum? Type custom questions, hardware kits, linear code parameters, or physical constraints. VorteX-AI will build specialized text diagnostics on-demand!
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <input
                  type="text"
                  value={customPromptText}
                  onChange={(e) => setCustomPromptText(e.target.value)}
                  placeholder="Examples: 'How do tension cables wear in Continuous lifts?' or 'How do I optimize AprilTag cameras in lower lighting?'"
                  className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] text-xs text-[var(--text-primary)] p-3 rounded-xl focus:outline-none focus:border-indigo-500 placeholder-[var(--text-secondary)]/50 font-sans"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleGenerateAiLesson();
                  }}
                />
                <button
                  onClick={handleGenerateAiLesson}
                  disabled={isAiGenerating || !customPromptText.trim()}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-black uppercase rounded-xl px-6 py-3 shrink-0 disabled:opacity-40 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  {isAiGenerating ? (
                    <>
                      <RotateCcw className="h-3.5 w-3.5 animate-spin" /> Synthesizing...
                    </>
                  ) : (
                    <>
                      Create Custom Lab <Sparkles className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>

              {/* RENDER DYNAMIC AI-GENERATED CUSTOM LAB TOPIC IF CREATED */}
              {aiCustomLesson && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[var(--bg-primary)] border border-indigo-500/20 rounded-2xl p-5 mt-6 relative overflow-hidden"
                >
                  <span className="text-[9px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded font-black tracking-widest uppercase">
                    AI-Constructed Micro-Lab Track
                  </span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-4">
                    {/* Study notes left */}
                    <div className="md:col-span-7 pr-2 flex flex-col gap-3">
                      <h4 className="text-base font-black uppercase text-[var(--text-primary)]">{aiCustomLesson.title}</h4>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed whitespace-pre-line font-sans">
                        {aiCustomLesson.explanation}
                      </p>
                      
                      <div className="bg-indigo-500/5 border border-indigo-500/15 p-4 rounded-xl text-[11px] text-[var(--text-secondary)] italic font-sans flex gap-2">
                        <Lightbulb className="h-4 w-4 shrink-0 text-[var(--accent)]" />
                        <span>{aiCustomLesson.practicalTip}</span>
                      </div>
                    </div>

                    {/* Diagnostic right */}
                    <div className="md:col-span-5 bg-[var(--card-bg)] border border-[var(--border)] p-4 rounded-xl">
                      <span className="text-[10px] font-mono text-indigo-400 font-bold block mb-2">DIAGNOSTIC TEST CHECKPOINT</span>
                      <p className="text-xs text-[var(--text-primary)] font-sans font-bold mb-3">{aiCustomLesson.quizQuestion}</p>
                      
                      <div className="flex flex-col gap-2">
                        {aiCustomLesson.quizOptions.map((opt: string, oIdx: number) => {
                          const isChosen = aiQuizAnswer === oIdx;
                          const isCorrect = oIdx === aiCustomLesson.correctOptionIndex;
                          return (
                            <button
                              key={oIdx}
                              onClick={() => {
                                setAiQuizAnswer(oIdx);
                                setShowAiFeedback(true);
                              }}
                              className={`w-full p-3 rounded-lg border text-left text-xs font-sans transition flex justify-between items-center ${
                                showAiFeedback
                                  ? isCorrect
                                    ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 font-semibold'
                                    : isChosen
                                      ? 'bg-rose-500/15 border-rose-500 text-rose-300 font-semibold'
                                      : 'border-[var(--border)] opacity-60'
                                  : isChosen
                                    ? 'border-indigo-500 bg-indigo-500/10'
                                    : 'border-[var(--border)] hover:border-indigo-500/50 hover:bg-indigo-500/5'
                              }`}
                            >
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {showAiFeedback && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-3 p-3 bg-[var(--bg-primary)] rounded-lg text-[10px] leading-relaxed text-[var(--text-secondary)] border border-[var(--border)] font-sans"
                        >
                          <span className={`block font-bold uppercase mb-1 font-mono ${
                            aiQuizAnswer === aiCustomLesson.correctOptionIndex ? 'text-emerald-400' : 'text-rose-400'
                          }`}>
                            {aiQuizAnswer === aiCustomLesson.correctOptionIndex ? '✓ Correct Alignment' : '✗ Tolerance Drifted'}
                          </span>
                          {aiCustomLesson.explanationOfAnswer}
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* STATE 3: THE IMMERSIVE LAB ROOM WITH SPECIALIZED SIMULATORS */}
        {wizardState === 'topic_lab' && activeTopic && (
          <motion.div
            key="topic_lab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex flex-col gap-5 text-left"
          >
            {/* Nav Back Header */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setWizardState('pathway_hub')}
                className="flex items-center gap-1.5 font-mono text-[11px] font-black uppercase text-indigo-400 hover:text-indigo-300 transition cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" /> Return to Path map
              </button>
              
              <div className="text-right">
                <span className="text-[10px] font-mono text-[var(--text-secondary)]">Active Track Location:</span>
                <span className="block text-xs font-mono font-black text-indigo-300 uppercase">
                  {findTopicMetadata(activeTopic.id)?.cat.title} / {findTopicMetadata(activeTopic.id)?.sub.title}
                </span>
              </div>
            </div>

            {/* MAIN LAP SPLIT GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* SIDE A: LESSON BLUEPRINTS / SCIENTIFIC GUIDE */}
              <div className="lg:col-span-5 bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6 flex flex-col justify-between gap-5 relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
                
                <div className="flex flex-col gap-4">
                  <div>
                    <span className="text-[9px] font-mono text-indigo-400 block font-bold uppercase tracking-widest">
                      :: Master Blueprint Guide
                    </span>
                    <h3 className="text-xl font-black uppercase text-[var(--text-primary)] mt-1 tracking-tight">
                      {activeTopic.title}
                    </h3>
                  </div>

                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed whitespace-pre-line font-sans bg-[var(--bg-primary)]/40 p-4 rounded-xl border border-[var(--border)]">
                    {activeTopic.explanation}
                  </p>

                  <div className="bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-xl text-[11px] text-[var(--text-secondary)] leading-relaxed font-sans relative">
                    <div className="absolute top-3 right-3 shrink-0"><Lightbulb className="h-4.5 w-4.5 text-amber-400 animate-pulse" /></div>
                    <strong className="block font-mono text-indigo-300 uppercase text-[9px] mb-1">PRO-LEVEL TEAM VORTEX TIP:</strong>
                    {activeTopic.practicalTip}
                  </div>
                </div>

                {/* DIAGNOSTIC CHECKPOINT CHALLENGE (Moved underneath side A to balance layout) */}
                <div className="mt-2 pt-5 border-t border-[var(--border)] flex flex-col gap-4">
                  <div className="flex items-center gap-1.5">
                    <HelpCircle className="h-4.5 w-4.5 text-indigo-400" />
                    <span className="text-[10px] font-mono font-bold text-[var(--text-primary)] uppercase">DIAGNOSTIC TEST CHALLENGE</span>
                  </div>
                  
                  <p className="text-xs text-[var(--text-primary)] font-bold font-sans">
                    {activeTopic.quizQuestion}
                  </p>

                  <div className="flex flex-col gap-2">
                    {activeTopic.quizOptions.map((opt, index) => {
                      const isChosen = quizAnswer === index;
                      const isCorrect = index === activeTopic.correctOptionIndex;
                      
                      return (
                        <button
                          key={index}
                          onClick={() => {
                            setQuizAnswer(index);
                            setShowAnswerFeedback(true);
                            if (isCorrect) {
                              markTopicAsMastered(activeTopic.id);
                            }
                          }}
                          className={`w-full p-3 rounded-xl border text-left text-xs font-sans transition flex justify-between items-center ${
                            showAnswerFeedback
                              ? isCorrect
                                ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 font-bold shadow-md'
                                : isChosen
                                  ? 'bg-rose-500/15 border-rose-500 text-rose-300 font-bold'
                                  : 'border-[var(--border)] opacity-60'
                              : isChosen
                                ? 'border-indigo-500 bg-indigo-500/10'
                                : 'border-[var(--border)] hover:border-indigo-500/50 hover:bg-indigo-500/5'
                          }`}
                        >
                          <span className="pr-4">{opt}</span>
                          {showAnswerFeedback && isCorrect && <span className="text-[9px] font-mono text-emerald-400">PASSED</span>}
                        </button>
                      );
                    })}
                  </div>

                  {showAnswerFeedback && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-3.5 bg-[var(--bg-primary)] rounded-xl border border-[var(--border)] text-[10px] leading-relaxed text-[var(--text-secondary)] font-sans"
                    >
                      <span className={`block font-mono font-black uppercase mb-1 tracking-wider ${
                        quizAnswer === activeTopic.correctOptionIndex ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {quizAnswer === activeTopic.correctOptionIndex ? '✓ Correct Alignment' : '✗ Tolerance Drifted'}
                      </span>
                      {activeTopic.explanationOfAnswer}
                    </motion.div>
                  )}
                </div>
              </div>

              {/* SIDE B: INTERACTIVE LAB SIMULATORS BASED ON CATEGORY */}
              <div className="lg:col-span-7 bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6 flex flex-col gap-5 text-left relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 to-rose-500" />
                
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[9px] font-mono text-purple-400 block font-bold uppercase tracking-widest">
                      :: VISUAL INTERACTIVE SANDBOX LAB
                    </span>
                    <h4 className="text-sm font-black uppercase text-[var(--text-primary)]">
                      {findTopicMetadata(activeTopic.id)?.cat.id === 'beginner-foundations' && 'Physics Assembly & Chassis Mechanics Lab'}
                      {findTopicMetadata(activeTopic.id)?.cat.id === 'intermediate-systems' && 'Logic Loops & State Transition Sandbox'}
                      {findTopicMetadata(activeTopic.id)?.cat.id === 'advanced-precision' && 'PID Calibration & Vector Trajectory Plotter'}
                      {findTopicMetadata(activeTopic.id)?.cat.id === 'expert-optimization' && 'High-Performance Sensor Fusion & Pipeline Terminal'}
                    </h4>
                  </div>
                  <span className="text-[8px] font-mono bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2 py-1 rounded uppercase tracking-wider font-extrabold flex items-center gap-1">
                    <Activity className="h-3 w-3 animate-pulse" /> SIM COMPILER LIVE
                  </span>
                </div>

                {/* THE SIM WIDGETS RENDERING BLOCK */}
                <div className="bg-[var(--bg-primary)] rounded-2xl p-4 border border-[var(--border)] flex-1 flex flex-col justify-between gap-4 min-h-[380px] text-left">
                  
                  {/* SIM CASE 1: BEGINNER FOUNDATIONS - MECHANICAL ASSEMBLY & LIFT physics */}
                  {findTopicMetadata(activeTopic.id)?.cat.id === 'beginner-foundations' && (
                    <div className="flex-1 flex flex-col justify-between gap-4">
                      <div className="text-left">
                        <span className="text-[10px] font-mono text-[var(--text-secondary)] uppercase block">Mechanism Assembly stress lab</span>
                        <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed mt-1">
                          Adjust mechanical load values, motor count inputs, and slide ratios to dynamically calculate lift velocity limits and mechanical stall factors.
                        </p>
                      </div>

                      {/* Display live math simulation output */}
                      {(() => {
                        // Math calculations for torque and velocity
                        const loadNewton = (mechMassInput * 0.453592) * 9.81; // lbs to N
                        const hubRadiusMeter = (mechWinchRadius * 0.0254); // inches to m
                        const requiredTorque = (loadNewton * hubRadiusMeter) / mechSlideStages; // divided by cascade mechanics
                        const isStalling = requiredTorque > (2.1 * (mechWinchRadius / 0.5)); // estimate stall torque threshold
                        const liftInchesPerSec = ((300 / mechGearRatio) * (2 * Math.PI * mechWinchRadius)) / 60;

                        return (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
                            {/* Visual Lift Bar */}
                            <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden">
                              <span className="text-[8px] font-mono text-[var(--text-secondary)] absolute top-2 left-2">Elevator Tension Gauge</span>
                              <div className="w-12 bg-indigo-950 h-32 rounded border border-[var(--border)] relative overflow-hidden flex items-end p-0.5">
                                <div 
                                  className={`w-full rounded transition-all duration-300 ${isStalling ? 'bg-rose-500 animate-pulse' : 'bg-emerald-400'}`}
                                  style={{ height: `${Math.min(100, Math.max(10, 100 - (requiredTorque * 120)))}%` }}
                                />
                              </div>
                              <span className="text-[9px] font-mono font-bold text-[var(--text-primary)] mt-2">
                                Stage Height: {(liftInchesPerSec * 1.5).toFixed(1)} in
                              </span>
                            </div>

                            {/* Calculated outputs */}
                            <div className="flex flex-col gap-2 justify-center font-mono">
                              <div className="bg-[var(--card-bg)] border border-[var(--border)] p-2.5 rounded-lg text-left">
                                <span className="text-[8px] text-[var(--text-secondary)] block">GRAVITY DOWN TORQUE</span>
                                <span className="text-xs font-black text-[var(--text-primary)]">{requiredTorque.toFixed(3)} N·m</span>
                              </div>
                              <div className="bg-[var(--card-bg)] border border-[var(--border)] p-2.5 rounded-lg text-left">
                                <span className="text-[8px] text-[var(--text-secondary)] block">THEORETICAL LIFT VELOCITY</span>
                                <span className="text-xs font-black text-indigo-400">{liftInchesPerSec.toFixed(2)} inches/sec</span>
                              </div>
                              <div className="bg-[var(--card-bg)] border border-[var(--border)] p-2.5 rounded-lg text-left">
                                <span className="text-[8px] text-[var(--text-secondary)] block">RIGGING STATUS</span>
                                <span className={`text-[10px] font-black ${isStalling ? 'text-rose-400' : 'text-emerald-400'}`}>
                                  {isStalling ? '⚠ MOTOR Sinks / STALL PROBABLE' : '✓ Static Force is balanced'}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Slider controls */}
                      <div className="grid grid-cols-2 gap-4 border-t border-[var(--border)] pt-4">
                        <div className="flex flex-col gap-1 text-left">
                          <label className="font-mono text-[9px] uppercase font-bold text-[var(--text-secondary)]">
                            Load Mass: {mechMassInput} lbs
                          </label>
                          <input 
                            type="range" min="1" max="25" step="1"
                            value={mechMassInput}
                            onChange={(e) => setMechMassInput(Number(e.target.value))}
                            className="w-full h-1.5 bg-indigo-950 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                        <div className="flex flex-col gap-1 text-left">
                          <label className="font-mono text-[9px] uppercase font-bold text-[var(--text-secondary)]">
                            Planetary reduction: {mechGearRatio}:1
                          </label>
                          <input 
                            type="range" min="5" max="100" step="1"
                            value={mechGearRatio}
                            onChange={(e) => setMechGearRatio(Number(e.target.value))}
                            className="w-full h-1.5 bg-indigo-950 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SIM CASE 2: INTERMEDIATE SYSTEMS - STATE TRANSITION LOGIC & TELEMETRY */}
                  {findTopicMetadata(activeTopic.id)?.cat.id === 'intermediate-systems' && (
                    <div className="flex-1 flex flex-col justify-between gap-4">
                      <div className="text-left">
                        <span className="text-[10px] font-mono text-[var(--text-secondary)] uppercase block">Non-Blocking State Loop Simulator</span>
                        <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed mt-1">
                          Program structural state transitions. Toggle the active loop execution to watch sensor parameters evaluate transitions in real time.
                        </p>
                      </div>

                      {/* Transition timeline */}
                      <div className="flex flex-col md:flex-row gap-2 border border-[var(--border)] bg-[var(--card-bg)] p-3.5 rounded-xl justify-between items-stretch">
                        {fsmStages.map((stage, idx) => {
                          const isActive = fsmActiveIndex === idx && fsmLoopActive;
                          return (
                            <div 
                              key={stage}
                              className={`flex-1 p-2.5 rounded-lg border text-center transition flex flex-col items-center justify-center gap-1 relative ${
                                isActive 
                                  ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_12px_rgba(99,102,241,0.2)]' 
                                  : 'border-[var(--border)] bg-[var(--bg-primary)]/40'
                              }`}
                            >
                              <span className="text-[8px] font-mono text-[var(--text-secondary)]">STAGE 0{idx+1}</span>
                              <span className="text-[10px] font-mono font-black uppercase text-[var(--text-primary)] tracking-tighter truncate max-w-full">
                                {stage}
                              </span>
                              {isActive && (
                                <span className="absolute -bottom-1 -inset-x-2 bg-indigo-500 h-0.5 rounded animate-pulse" />
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Terminal logging feedback */}
                      <div className="bg-black/95 text-emerald-400 font-mono text-[10px] p-4 rounded-xl border border-[var(--border)] min-h-[140px] max-h-[160px] overflow-y-auto flex flex-col gap-1 text-left custom-scrollbar relative">
                        <span className="text-[8px] text-[var(--text-secondary)] absolute top-2 right-2 uppercase">Telemetry Stream</span>
                        {terminalLogs.length === 0 ? (
                          <div className="text-gray-500 italic mt-6 text-center">Click "Execute State Loop" to stream hardware telemetry log strings down...</div>
                        ) : (
                          terminalLogs.map((log, idx) => (
                            <div key={idx} className="truncate select-none">{log}</div>
                          ))
                        )}
                      </div>

                      {/* Start Actions */}
                      <div className="border-t border-[var(--border)] pt-4 flex gap-3">
                        <button
                          onClick={() => {
                            setFsmLoopActive(!fsmLoopActive);
                            if(!fsmLoopActive) {
                              setTerminalLogs(['[SYSTEM] Loop initialized. Commencing thread cycle logs...', ...terminalLogs]);
                            }
                          }}
                          className={`flex-1 py-3 px-4 font-mono text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center justify-center gap-2 ${
                            fsmLoopActive 
                              ? 'bg-rose-500/20 border border-rose-500/40 text-rose-300' 
                              : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                          }`}
                        >
                          <Play className={`h-4 w-4 ${fsmLoopActive ? 'animate-spin' : ''}`} />
                          {fsmLoopActive ? 'HALT STATE EXECUTION' : 'EXECUTE STATE LOOP'}
                        </button>
                        <button
                          onClick={() => {
                            setTerminalLogs([]);
                            setFsmActiveIndex(0);
                            setFsmLoopActive(false);
                          }}
                          className="px-4 border border-[var(--border)] hover:border-indigo-500/40 bg-transparent text-[var(--text-secondary)] rounded-xl transition cursor-pointer flex items-center justify-center"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  )}

                  {/* SIM CASE 3: ADVANCED PRECISION - PID TUNING PHYSICS CANVAS */}
                  {findTopicMetadata(activeTopic.id)?.cat.id === 'advanced-precision' && (
                    <div className="flex-1 flex flex-col justify-between gap-4">
                      <div className="text-left">
                        <span className="text-[10px] font-mono text-[var(--text-secondary)] uppercase block">PID & PIDF Control Loop Simulator</span>
                        <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed mt-1">
                          Tune Proportional, Integral, and Derivative coefficients. Move target positions dynamically to see damped mechanical oscillations on the settling plotter.
                        </p>
                      </div>

                      {/* Simulated Interactive Graph */}
                      {(() => {
                        // Generate a simulated settling curve array depending on PID coefficients manually!
                        const points: string[] = [];
                        const samples = 120;
                        const target = physicsTarget;
                        const kp = pidKp * 12;
                        const kd = pidKd * 40;
                        const ki = pidKi * 6;

                        for (let i = 0; i < samples; i++) {
                          const t = i / 18;
                          // A simplified second-order step response formula:
                          // y(t) = Target - Target * e^(-sigma*t) * (cos(omega*t) + sin(omega*t))
                          const damping = Math.max(0.2, 2.5 - kd + (kp * 0.1));
                          const frequency = Math.max(1, 4 + kp - (kd * 0.2));
                          const steadyBias = Math.max(-5, Math.min(5, (10 - ki * 3))); // offset if Ki is low
                          
                          const responseVal = target - target * Math.exp(-damping * t) * Math.cos(frequency * t) + (i === samples - 1 ? 0 : steadyBias * Math.sin(t * 0.1));
                          const yPos = Math.max(10, Math.min(130, 130 - (responseVal * 0.75)));
                          points.push(`${(i * 3.7)}.5,${yPos}`);
                        }

                        const linePath = points.join(' ');

                        return (
                          <div className="my-2 select-none relative">
                            {/* Graphic Chart */}
                            <svg className="w-full h-36 bg-black/95 border border-[var(--border)] rounded-xl relative overflow-hidden" viewBox="0 0 450 140">
                              <span className="text-[7px] font-mono text-[var(--text-secondary)] absolute top-1 right-2">Settling graph plotter</span>
                              {/* Grid lines */}
                              <line x1="0" y1="35" x2="450" y2="35" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" />
                              <line x1="0" y1="70" x2="450" y2="70" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" />
                              <line x1="0" y1="105" x2="450" y2="105" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" />
                              
                              {/* Horizontal target guide */}
                              <line 
                                x1="0" y1={130 - (target * 0.75)} 
                                x2="450" y2={130 - (target * 0.75)} 
                                stroke="#f59e0b" 
                                strokeDasharray="3,3" 
                                strokeWidth="1.5" 
                              />
                              <text x="10" y={120 - (target * 0.75)} fill="#f59e0b" fontSize="8" fontFamily="monospace">TARGET VALUE</text>

                              {/* Simulated trace curve path */}
                              <polyline
                                fill="none"
                                stroke="#6366f1"
                                strokeWidth="2"
                                points={linePath}
                                className="stroke-dash"
                              />

                              {/* Dot representing robot current */}
                              {points.length > 0 && (() => {
                                const lastPoint = points[points.length - 1].split(',');
                                return (
                                  <circle 
                                    cx="444" 
                                    cy={lastPoint[1]} 
                                    r="4.5" 
                                    className="fill-indigo-400 animate-ping" 
                                  />
                                );
                              })()}
                            </svg>
                          </div>
                        );
                      })()}

                      {/* Parameter settings sliders */}
                      <div className="grid grid-cols-3 gap-3 border-t border-[var(--border)] pt-4 text-left">
                        <div className="flex flex-col gap-1">
                          <label className="font-mono text-[9px] uppercase font-bold text-indigo-300">
                            Proportional Kp: {pidKp.toFixed(2)}
                          </label>
                          <input 
                            type="range" min="0.01" max="1.5" step="0.01"
                            value={pidKp}
                            onChange={(e) => setPidKp(Number(e.target.value))}
                            className="w-full h-1.5 bg-indigo-950 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-mono text-[9px] uppercase font-bold text-amber-300">
                            Integral Ki: {pidKi.toFixed(2)}
                          </label>
                          <input 
                            type="range" min="0.0" max="0.5" step="0.01"
                            value={pidKi}
                            onChange={(e) => setPidKi(Number(e.target.value))}
                            className="w-full h-1.5 bg-indigo-950 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-mono text-[9px] uppercase font-bold text-rose-300">
                            Derivative Kd: {pidKd.toFixed(2)}
                          </label>
                          <input 
                            type="range" min="0.0" max="1.0" step="0.01"
                            value={pidKd}
                            onChange={(e) => setPidKd(Number(e.target.value))}
                            className="w-full h-1.5 bg-indigo-950 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SIM CASE 4: EXPERT OPTIMIZATION - CAMERA COMPUTER VISION FILTERS */}
                  {findTopicMetadata(activeTopic.id)?.cat.id === 'expert-optimization' && (
                    <div className="flex-1 flex flex-col justify-between gap-4">
                      <div className="text-left">
                        <span className="text-[10px] font-mono text-[var(--text-secondary)] uppercase block">OpenCV Camera Filter Pipeline sandbox</span>
                        <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed mt-1">
                          Slide Hue, Saturation, and Value thresholds to configure color-bounds, or select different pipeline filters to see image contour processing.
                        </p>
                      </div>

                      {/* Interactive Simulated Video Frame canvas */}
                      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl relative overflow-hidden h-36 flex items-center justify-center overflow-hidden flex flex-col justify-between">
                        <div className="absolute top-2 left-2 flex gap-1 z-10">
                          {['raw', 'hsv', 'edge', 'contour'].map((filter) => (
                            <button
                              key={filter}
                              onClick={() => setCvPipelineFilter(filter as any)}
                              className={`font-mono text-[8px] uppercase tracking-wider px-2 py-0.5 rounded transition ${
                                cvPipelineFilter === filter 
                                  ? 'bg-purple-600 text-white' 
                                  : 'bg-[var(--bg-primary)]/80 text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] border border-[var(--border)]'
                              }`}
                            >
                              {filter} VIEW
                            </button>
                          ))}
                        </div>

                        {/* Rendering dynamic graphic representation based on filter */}
                        <div className={`w-full h-full flex flex-col items-center justify-center transition-all ${
                          cvPipelineFilter === 'raw' ? 'bg-indigo-950/20' :
                          cvPipelineFilter === 'hsv' ? 'bg-purple-950/60 grayscale contrast-150' :
                          cvPipelineFilter === 'edge' ? 'bg-black border border-indigo-500/20 invert opacity-95' :
                          'bg-black/95'
                        }`}>
                          
                          {/* Visual element representing a camera block */}
                          <div className={`w-14 h-14 rounded-full border-2 transition-all relative ${
                            cvPipelineFilter === 'edge' ? 'border-indigo-400 border-dashed animate-spin' :
                            cvPipelineFilter === 'contour' ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] border-double scale-110' :
                            'border-[var(--accent)]'
                          }`}>
                            <div className="absolute inset-1 bg-gradient-to-r from-transparent to-black/20 rounded-full" />
                          </div>

                          {/* Computed coordinates parameters */}
                          <div className="absolute bottom-2 right-2 font-mono text-[8px] text-[var(--accent)] bg-black/80 px-2 py-1 rounded text-right flex flex-col max-w-[120px]">
                            <span>CAM OFFSET ESTIMATED:</span>
                            <span className="text-white">X: +{(hsvHueMin * 0.1).toFixed(2)} in</span>
                            <span className="text-white">Y: -{(hsvSatMin * 0.05).toFixed(2)} in</span>
                            <span className="text-white">Z: +{(hsvValMin * 0.15).toFixed(2)} in</span>
                          </div>
                        </div>
                      </div>

                      {/* Filter Tuning sliders */}
                      <div className="grid grid-cols-3 gap-3 border-t border-[var(--border)] pt-4 text-left font-mono text-[9px]">
                        <div className="flex flex-col gap-1">
                          <label className="uppercase font-bold text-indigo-300">
                            Hue Min: {hsvHueMin}
                          </label>
                          <input 
                            type="range" min="0" max="180" step="1"
                            value={hsvHueMin}
                            onChange={(e) => setHsvHueMin(Number(e.target.value))}
                            className="w-full h-1.5 bg-indigo-950 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="uppercase font-bold text-amber-300">
                            Sat Min: {hsvSatMin}
                          </label>
                          <input 
                            type="range" min="0" max="255" step="1"
                            value={hsvSatMin}
                            onChange={(e) => setHsvSatMin(Number(e.target.value))}
                            className="w-full h-1.5 bg-indigo-950 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="uppercase font-bold text-purple-300">
                            Val Min: {hsvValMin}
                          </label>
                          <input 
                            type="range" min="0" max="255" step="1"
                            value={hsvValMin}
                            onChange={(e) => setHsvValMin(Number(e.target.value))}
                            className="w-full h-1.5 bg-indigo-950 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>

            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
