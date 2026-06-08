import { TrainingResource } from '../types';

export const trainingResources: TrainingResource[] = [
  {
    id: 'res-1',
    title: 'Custom Linear OpMode Template (Java)',
    description: 'Our baseline Autonomous/TeleOp structure. Features safe motor initialization, hardware maps, power telemetry, and standard loop controllers.',
    category: 'Programming',
    difficulty: 'Beginner',
    readTime: '5 min read',
    codeLanguage: 'java',
    codeSnippet: `package org.firstinspires.ftc.teamcode;

import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.hardware.DcMotor;
import com.qualcomm.robotcore.hardware.DcMotorSimple;

@TeleOp(name = "Vortex: BaseDrive", group = "TeleOp")
public class VortexBaseDrive extends LinearOpMode {

    // Declare drive motors
    private DcMotor leftFront, rightFront, leftBack, rightBack;

    @Override
    public void runOpMode() {
        // Initialize hardware maps matching REV config
        leftFront  = hardwareMap.get(DcMotor.class, "lf");
        rightFront = hardwareMap.get(DcMotor.class, "rf");
        leftBack   = hardwareMap.get(DcMotor.class, "lb");
        rightBack  = hardwareMap.get(DcMotor.class, "rb");

        // Set direction (usually reverse left motors due to gear alignment)
        leftFront.setDirection(DcMotorSimple.Direction.REVERSE);
        leftBack.setDirection(DcMotorSimple.Direction.REVERSE);

        // Zero Power Behavior
        leftFront.setZeroPowerBehavior(DcMotor.ZeroPowerBehavior.BRAKE);
        rightFront.setZeroPowerBehavior(DcMotor.ZeroPowerBehavior.BRAKE);
        leftBack.setZeroPowerBehavior(DcMotor.ZeroPowerBehavior.BRAKE);
        rightBack.setZeroPowerBehavior(DcMotor.ZeroPowerBehavior.BRAKE);

        telemetry.addData("Status", "Initialized! Ready to Vortex.");
        telemetry.update();

        waitForStart();

        while (opModeIsActive()) {
            // Mecanum drive calculations
            double y   = -gamepad1.left_stick_y; // Forward/Back
            double x   = gamepad1.left_stick_x  * 1.1; // Strafe compensation
            double rx  = gamepad1.right_stick_x; // Turn

            double denominator = Math.max(Math.abs(y) + Math.abs(x) + Math.abs(rx), 1.0);
            double lfPower = (y + x + rx) / denominator;
            double rfPower = (y - x - rx) / denominator;
            double lbPower = (y - x + rx) / denominator;
            double rbPower = (y + x - rx) / denominator;

            // Apply motor powers
            leftFront.setPower(lfPower);
            rightFront.setPower(rfPower);
            leftBack.setPower(lbPower);
            rightBack.setPower(rbPower);

            telemetry.addData("LF / RF Power", "%.2f / %.2f", lfPower, rfPower);
            telemetry.addData("LB / RB Power", "%.2f / %.2f", lbPower, rbPower);
            telemetry.update();
        }
    }
}`,
    guideSteps: [
      'Create a new class under org.firstinspires.ftc.teamcode in Android Studio or OnBotJava.',
      'Copy this blueprint template structure to handle reliable configuration mapping.',
      'Map physical port names precisely to the REV Hub config config file name.',
      'Use ZeroPowerBehavior.BRAKE for high precision snapping, or FLOAT for organic coasting.',
      'Run the LinearOpMode on the driver station to review active real-time motor telemetry.'
    ],
    externalLinks: [
      { label: 'Official FIRST SDK Javadocs', url: 'https://javadoc.io/doc/org.firstinspires.ftccode/RobotCore' },
      { label: 'FTC Robot Controller Repository', url: 'https://github.com/FIRST-Tech-Challenge/FtcRobotController' }
    ]
  },
  {
    id: 'res-2',
    title: 'Onshape Best Practices: FTC CAD Design Workflow',
    description: 'Learn how Vortex organizes assembly tabs, leverages Part Studios, and imports external high-precision REV/goBILDA library components.',
    category: 'CAD',
    difficulty: 'Intermediate',
    readTime: '6 min',
    guideSteps: [
      'Install the goBILDA FTC parts library applet into your Onshape workspace.',
      'Always sketch on primary coordinate planes; restrict arbitrary spatial offsets.',
      'Group similar subcomponents (e.g. Drivetrain side rails) into dedicated Sub-Assemblies.',
      'Use "Group Fasteners" features to insert all spacing spacers, bolts, and lock nuts automatically.',
      'Before machining, run full clearance checks to ensure gears and spinning parts don’t scrape structural brackets.'
    ],
    externalLinks: [
      { label: 'Vortex Public Onshape CAD Workspace', url: 'https://cad.onshape.com/' },
      { label: 'goBILDA Part Finder Catalog', url: 'https://www.gobilda.com/' }
    ]
  },
  {
    id: 'res-3',
    title: 'Limelight 3G Object Classification: Machine Learning Guide',
    description: 'Step-by-step setup to train visual pipelines for custom game object recognition using Limelight tensor models.',
    category: 'Programming',
    difficulty: 'Advanced',
    readTime: '8 min read',
    codeLanguage: 'python',
    codeSnippet: `# Python snippet representing how Limelight extracts JSON network target streams
import socket
import json

def get_limelight_data(ip_address="10.0.0.12"):
    # Limelight continuously broadcasts JSON payloads over UDP port 5802
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    client_socket.bind(("", 5802))
    
    while True:
        data, addr = client_socket.recvfrom(1024)
        payload = json.loads(data.decode("utf-8"))
        
        # Parse targets
        targets = payload.get("targets", [])
        if targets:
            for t in targets:
                print(f"Target found: TagID={t.get('id')}, Rotation={t.get('rt')}")
                # Use targets to compute pose matrices`,
    guideSteps: [
      'Connect the Limelight camera ethernet pin directly to the robot hub switch.',
      'Access local control room UI via http://limelight.local:5801 on your browser.',
      'Record 100+ images of the seasonal game pieces under varying brightness.',
      'Upload neural classification files and assign custom pipeline thresholds.',
      'Write Java/Kotlin routines to decode JSON fields and align physical gear structures.'
    ],
    externalLinks: [
      { label: 'Limelight Hardware Manual', url: 'https://docs.limelightvision.io/' },
      { label: 'WPILib Vision Processing Docs', url: 'https://docs.wpilib.org/en/stable/' }
    ]
  },
  {
    id: 'res-4',
    title: 'Structuring a Winning Engineering Notebook & Portfolio',
    description: 'A structural checklist of what judges look for in the Engineering portfolio, outlining engineering calculations, outreach matrices, and design loops.',
    category: 'Notebook & Outreach',
    difficulty: 'Beginner',
    readTime: '4 min',
    guideSteps: [
      'Ensure the portfolio is strict to the 15-page limit rules.',
      'Present engineering feedback cycles clearly (e.g. Outline Issue -> Draw CAD -> Machine Prototype -> Evaluate -> Rework).',
      'Add a budget log showing clear sponsors, detailing how funds were utilized.',
      'Include team bios featuring clear member roles and contributions.',
      'Highlight outreach statistics including quantitative details like students reached, workshops hosted, or media outputs.'
    ],
    externalLinks: [
      { label: 'FIRST FTC Official Resource Library', url: 'https://www.firstinspires.org/resource-library/ftc' }
    ]
  },
  {
    id: 'res-5',
    title: 'AprilTag Localization with VisionPortal',
    description: 'Implementing real-time coordinate correction and target alignment using the native FTC SDK AprilTagProcessor and custom camera configurations.',
    category: 'Programming',
    difficulty: 'Advanced',
    readTime: '8 min read',
    codeLanguage: 'java',
    codeSnippet: `package org.firstinspires.ftc.teamcode.vision;

import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import org.firstinspires.ftc.robotcore.external.hardware.camera.WebcamName;
import org.firstinspires.ftc.vision.VisionPortal;
import org.firstinspires.ftc.vision.apriltag.AprilTagDetection;
import org.firstinspires.ftc.vision.apriltag.AprilTagProcessor;
import java.util.List;

@TeleOp(name = "AprilTag Autonomous Localizer")
public class AprilTagLocalizer extends LinearOpMode {
    @Override
    public void runOpMode() {
        AprilTagProcessor aprilTag = new AprilTagProcessor.Builder().build();
        VisionPortal visionPortal = new VisionPortal.Builder()
                .setCamera(hardwareMap.get(WebcamName.class, "Webcam 1"))
                .addProcessor(aprilTag)
                .build();

        waitForStart();

        while (opModeIsActive()) {
            List<AprilTagDetection> detections = aprilTag.getDetections();
            for (AprilTagDetection detection : detections) {
                if (detection.metadata != null) {
                    telemetry.addData("ID", detection.id);
                    telemetry.addData("Range (in)", detection.ftcPose.range);
                    telemetry.addData("Bearing (deg)", detection.ftcPose.bearing);
                }
            }
            telemetry.update();
        }
    }
}`,
    guideSteps: [
      'Initialize the Webcam and AprilTagProcessor using the official VisionPortal.Builder model.',
      'Query active detections inside the main OpMode loop structure to retrieve range, bearing, and elevation details.',
      'Apply offset calibration calculations to determine the robot’s precise center position relative to the field tag coordinates.',
      'Optionally set custom decimation rates and stream exposure settings to reduce camera frame latency.',
      'Integrate corrective actions directly into autonomous path control logic based on detection poses.'
    ],
    externalLinks: [
      { label: 'FTC Official Vision Portal Wiki', url: 'https://ftc-docs.firstinspires.org/' }
    ]
  },
  {
    id: 'res-6',
    title: 'PID Speed Controller Implementation',
    description: 'A standard Java framework for custom Closed-Loop PID controls on critical robotic arms, sliders, or shooter setups to avoid violent bounceback.',
    category: 'Programming',
    difficulty: 'Intermediate',
    readTime: '6 min read',
    codeLanguage: 'java',
    codeSnippet: `package org.firstinspires.ftc.teamcode.subsystems;

import com.qualcomm.robotcore.util.ElapsedTime;

public class PIDController {
    private double kp, ki, kd;
    private double integralSum = 0;
    private double lastError = 0;
    private ElapsedTime timer = new ElapsedTime();

    public PIDController(double kp, double ki, double kd) {
        this.kp = kp;
        this.ki = ki;
        this.kd = kd;
        timer.reset();
    }

    public double calculate(double target, double current) {
        double error = target - current;
        double dt = timer.seconds();
        timer.reset();

        // Avoid division by zero on rapid loops
        if (dt <= 0) dt = 0.001;

        // Anti-windup clamping to prevent runaway integrals
        if (Math.abs(error) < 50) {
            integralSum += error * dt;
        }

        double derivative = (error - lastError) / dt;
        lastError = error;

        return (kp * error) + (ki * integralSum) + (kd * derivative);
    }
}`,
    guideSteps: [
      'Create a customized class to package PID tuning coefficients separate from OpMode loops.',
      'Track error derivatives over a high-resolution time clock (dt) to keep derivative terms smooth.',
      'Apply anti-windup constraints to the integral sum to prevent extreme command output spikes.',
      'Implement target deadbands to safely turn off motors when within reasonable threshold offsets.',
      'Incorporate a feedforward target offset (kF) to counter constant gravity pulls on lifters.'
    ],
    externalLinks: [
      { label: 'Control Theory Fundamentals Video', url: 'https://www.youtube.com/user/ControlLectures' }
    ]
  },
  {
    id: 'res-7',
    title: 'Rigid Chassis Assembly & Chain Tensioning',
    description: 'Structure assembly practices for structural grid framing, lock-nut installation, and maintaining tension in drive chains and custom belt systems to prevent slips.',
    category: 'Hardware',
    difficulty: 'Beginner',
    readTime: '5 min read',
    guideSteps: [
      'Align multi-hole pattern structural channels (e.g. goBILDA 1120 Series U-Channel) orthogonally.',
      'Use dynamic lock nuts (Nyloc) instead of standard hex nuts to counter high-frequency chassis vibrations.',
      'Measure belt/chain deflection; aim for 3-5mm of free play over tensioned spans to curb motor axle wear.',
      'Install plastic hub spacers behind gears and pulleys to eliminate axial shaft play.',
      'Debris-proof all exposed gears using thin-gauge polycarbonate protective wrap shields.'
    ],
    externalLinks: [
      { label: 'goBILDA Structural Elements Catalog', url: 'https://www.gobilda.com/' },
      { label: 'FTC Robot Safety & Inspection Manual', url: 'https://www.firstinspires.org/' }
    ]
  },
  {
    id: 'res-8',
    title: '3D Printing Intake Gears & Molded TPU Rollers',
    description: 'Designing high-traction game object intakes using custom-sliced flexible TPU and shatter-resistant PETG filament configurations.',
    category: 'Hardware',
    difficulty: 'Intermediate',
    readTime: '7 min read',
    guideSteps: [
      'Set extrusion infill density of TPU rollers to ~15-20% with a gyroid pattern to maximize impact flexing.',
      'Print mechanical gears in PETG or Carbon Fiber Polycarbonate instead of PLA to withstand active torque shifts.',
      'Implement a 0.2mm tolerance clearance between mechanical slider gears and standard shaft profiles.',
      'Post-process components with a brief heat gun exposure to resolve spider-web filament stringing.',
      'Examine printed gears under high-intensity stress tests to catch hairline layer separation zones early.'
    ],
    externalLinks: [
      { label: 'Printables FTC Community CAD Library', url: 'https://www.printables.com/' },
      { label: 'PrusaSlicer Speed/Tension Setup Guide', url: 'https://help.prusa3d.com/' }
    ]
  },
  {
    id: 'res-9',
    title: 'Pitching & Hosting Local Community STEM Camps',
    description: 'Detailed campaign playbook and presentation assets to obtain corporate sponsorships and execute impactful community outreach programs.',
    category: 'Notebook & Outreach',
    difficulty: 'Beginner',
    readTime: '5 min read',
    guideSteps: [
      'Draft a concise 1-page sponsorship brochure illustrating regional demographics and impact reach.',
      'Partner with local public libraries or schools to host zero-cost robotics interactive workshops.',
      'Employ standard presentation structures detailing financial accountability and tax-exemption status.',
      'Gather feedback metrics (quantified surveys) from participants that prove community interest directly to local partners.',
      'Record high-definition video archives of children building prototypes to insert in Judge Presentation Slides.'
    ],
    externalLinks: [
      { label: 'FTC Mentorship & Outreach Blueprint', url: 'https://www.firstinspires.org/' }
    ]
  }
];
