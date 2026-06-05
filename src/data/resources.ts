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
  }
];
