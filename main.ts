
/*
 hicbit package
*/
//% weight=10 icon="\uf211" color=#6A5ACD
namespace hicbit {

    export let NEW_LINE = "\r\n";

    export enum hicbit_Port {
        //% block="port 1"
        port1 = 0x01,
        //% block="port 2"
        port2 = 0x02,
        //% block="port 3"
        port3 = 0x03,
        //% block="Port 4"
        port4 = 0x04
    }

    export enum hicbit_Colors {
        //% block="Red"
        Red = 0x01,
        //% block="Green"
        Green = 0x02,
        //% block="Blue"
        Blue = 0x03,
        //% block="Black"
        Black = 0x04,
        //% block="White"
        White = 0x05,
        //% block="None"
        None = 0x06
    }


    /**
     * hicbit initialization, please execute at boot time
    */
    //% weight=100 blockId=hicbit_Init block="Initialize hicbit"
    export function hicbit_Init() {

        led.enable(false);

        serial.redirect(
            SerialPin.P8,
            SerialPin.P12,
            BaudRate.BaudRate115200);

        basic.forever(() => {
            getHandleCmd();
        });
        basic.pause(1000);
    }


    let handleCmd: string = "";
    
    /**
    * Get the handle command.
    */
    function getHandleCmd() {
        let charStr: string = serial.readString();
        handleCmd = handleCmd.concat(charStr);
        handleCmd = "";
    }
    
    /**
    *	Set interface motor speed , range of -255~255, that can control turn.
    */
    //% weight=99 blockGap=50 blockId=hicbit_setMotorSpeed block="Set |port %port| motor|speed %speed|and|time(s) %time|"
    //% speed.min=-255 speed.max=255 
    //% time.min=0 time.max=20 
    export function hicbit_setMotorSpeed(port: hicbit_Port,speed: number,time:number) {
        let Turn: number = 0;//电机1：正 电机2：正
        let ports: number = 0;
        let time2: number = 0;
        let speed1: number = 0;
        let speed2: number = 0;
        let buf = pins.createBuffer(5);
        let buf2 = pins.createBuffer(5);

        if (speed > 255 || speed < -255) {
            return;
        } 

        if (port == 1 || port == 3)
            speed1 = speed;
        else if (port == 2 || port == 4)
            speed2 = speed;
        
        if (port == 1 || port == 2)
            ports = 0;      //第一组tb6612
        else if (port == 3 || port == 4)
            ports = 1;      //第二组tb6612
        
        if (speed1 < 0) {
            speed1 = speed1 * -1;
            if (speed2 > 0)
                Turn = 1;//电机1：反 电机2：正
            else {
                speed2 = speed2 * -1;
                Turn = 3;//电机1：反 电机2：反
            }
        }
        else if (speed2 < 0) { 
            speed2 = speed2 * -1;
            if (speed1 > 0)
                Turn = 2;//电机1：正 电机2：反
            else {
                speed1 = speed1 * -1;
                Turn = 3;//电机1：反 电机2：反
            }
        }
        
        buf[0] = 0x58;      //标志位
        buf[1] = Turn;
        buf[2] = speed1;
        buf[3] = speed2;
        buf[4] = ports;
        serial.writeBuffer(buf);
        serial.writeString(NEW_LINE);

        time2 = time * 1000;
        basic.pause(time2);
        
        buf2[0] = 0x58;      //标志位
        buf2[1] = Turn;
        buf2[2] = 0;
        buf2[3] = 0;
        buf2[4] = ports;
        serial.writeBuffer(buf2);
        serial.writeString(NEW_LINE);

        // basic.pause(200);
    }

    /**
    *	Set the speed of the number 1 motor and number 2 motor, range of -255~255, that can control turn.
    */
    //% weight=98 blockGap=50 blockId=hicbit_setMotorSpeed1 block="Set motor1 speed|%speed1|and motor2|speed %speed2and|time(s) %time|"
    //% speed1.min=-255 speed1.max=255
    //% speed2.min=-255 speed2.max=255
    //% time.min=0 time.max=20 
    export function hicbit_setMotorSpeed1(speed1: number, speed2: number,time:number) {
        let Turn: number = 0;//电机1：正 电机2：正
        let time2: number = 0;

        if (speed1 > 255 || speed1 < -255 || speed2 > 255 || speed2 < -255) {
            return;
        } 
        if (speed1 < 0) {
            speed1 = speed1 * -1;
            if (speed2 > 0)
                Turn = 1;//电机1：反 电机2：正
            else {
                speed2 = speed2 * -1;
                Turn = 3;//电机1：反 电机2：反
            }
        }
        else if (speed2 < 0) { 
            speed2 = speed2 * -1;
            if (speed1 > 0)
                Turn = 2;//电机1：正 电机2：反
            else {
                speed1 = speed1 * -1;
                Turn = 3;//电机1：反 电机2：反
            }
        }
        let buf = pins.createBuffer(5);
        buf[0] = 0x58;
        buf[1] = Turn;
        buf[2] = speed1;
        buf[3] = speed2;
        buf[4] = 0;
        serial.writeBuffer(buf);
        serial.writeString(NEW_LINE);

        time2 = time * 1000;
        basic.pause(time2);
        
        let buf2 = pins.createBuffer(5);
        buf2[0] = 0x58;      //标志位
        buf2[1] = Turn;
        buf2[2] = 0;
        buf2[3] = 0;
        buf2[4] = 0;
        serial.writeBuffer(buf2);
        serial.writeString(NEW_LINE);

        // basic.pause(200);
    }

    /**
    *	Set the speed of the number 3 motor and number 4 motor, range of -255~255, that can control turn.
    */
    //% weight=97 blockGap=50 blockId=hicbit_setMotorSpeed2 block="Set motor3 speed|%speed1|and motor4|speed %speed2and|time(s) %time|"
    //% speed1.min=-255 speed1.max=255
    //% speed2.min=-255 speed2.max=255
    //% time.min=0 time.max=20 
    export function hicbit_setMotorSpeed2(speed1: number, speed2: number,time:number) {
        let Turn: number = 0;//电机1：正 电机2：正
        let time2: number = 0;

        if (speed1 > 255 || speed1 < -255 || speed2 > 255 || speed2 < -255) {
            return;
        } 
        if (speed1 < 0) {
            speed1 = speed1 * -1;
            if (speed2 > 0)
                Turn = 1;//电机1：反 电机2：正
            else {
                speed2 = speed2 * -1;
                Turn = 3;//电机1：反 电机2：反
            }
        }
        else if (speed2 < 0) { 
            speed2 = speed2 * -1;
            if (speed1 > 0)
                Turn = 2;//电机1：正 电机2：反
            else {
                speed1 = speed1 * -1;
                Turn = 3;//电机1：反 电机2：反
            }
        }
        let buf = pins.createBuffer(5);
        buf[0] = 0x58;
        buf[1] = Turn;
        buf[2] = speed1;
        buf[3] = speed2;
        buf[4] = 1;
        serial.writeBuffer(buf);
        serial.writeString(NEW_LINE);

        time2 = time * 1000;
        basic.pause(time2);
        
        let buf2 = pins.createBuffer(5);
        buf2[0] = 0x58;      //标志位
        buf2[1] = Turn;
        buf2[2] = 0;
        buf2[3] = 0;
        buf2[4] = 1;
        serial.writeBuffer(buf2);
        serial.writeString(NEW_LINE);

        // basic.pause(200);
    }


}

/*
 Sensor package
*/
//% weight=9 icon="\uf210" color=#666666
namespace Sensor{
    
    export enum hicbit_Port {
        //% block="port A"
        port4 = 0x01,
        //% block="port B"
        port3 = 0x02,
        //% block="port C"
        port2 = 0x03,
        //% block="Port D"
        port1 = 0x04
    }

    export enum IRKEY {
        //% block="CH-"
        CH_MINUS=162,
        //% block="CH"
        CH=98,
        //% block="CH+"
        CH_ADD=226,
        //% block="PREV"
        PREV=34,
        //% block="NEXT"
        NEXT=2,
        //% block="PLAY/PAUSE"
        PLAY_PAUSE=194,
        //% block="+"
        ADD=168,
        //% block="-"
        MINUS=224,
        //% block="EQ"
        EQ=144,
        //% block="100+"
        _100=152,
        //% block="200+"
         _200 = 176,
        //% block="A"
        A=0x0C,
        //% block="B"
        B=0x8C,
        //% block="C"
        C = 0x4C,
        //% block="D"
        D = 0xCC,     
        //% block="E"
        E = 0xAC,   
        //% block="F"
        F = 0x5C,   
        //% block="UP"
        UP = 0X2C,
        //% block="DOWN"
        DOWN = 0X9C,  
        //% block="LEFT"
        LEFT = 0X6C,
        //% block="RIGHT"
        RIGHT = 0X1C, 
        //% block="SET"
        SET = 0XEC, 
        //% block="R0"
         R0 = 104,
        //% block="R1"
        R1=48,
        //% block="R2"
        R2=24,
        //% block="R3"
        R3=122,
        //% block="R4"
        R4=16,
        //% block="R5"
        R5=56,
        //% block="R6"
        R6=90,
        //% block="R7"
        R7=66,
        //% block="R8"     
        R8=74,
        //% block="R9"
        R9=82
    }

    export enum enRocker {
        //% blockId="Nostate" block="无"
        Nostate = 0,
        //% blockId="Up" block="上"
        Up,
        //% blockId="Down" block="下"
        Down,
        //% blockId="Left" block="左"
        Left,
        //% blockId="Right" block="右"
        Right,
    }

    export enum Dht11Result {
        //% block="Celsius"
        Celsius,
        //% block="Fahrenheit"
        Fahrenheit,
        //% block="humidity"
        humidity
    }


    export enum buzzer {
        //% block="ring"
        ring = 0x01,
        //% block="Not_ringing"
        Not_ringing = 0x02,
    }

    /**
        * Buzzer
        */
    //% weight=100 blockId=Buzzer block="Buzzer(P0):| %buzzer"
    export function Buzzer(buz: buzzer): void {
        switch (buz) {
            case Sensor.buzzer.ring:
                pins.digitalWritePin(DigitalPin.P0, 1);
                break;
            case Sensor.buzzer.Not_ringing:
                pins.digitalWritePin(DigitalPin.P0, 0);
                break;
        }
    }

    /**
     * Get the line follower sensor port ad value 巡线
     */
    //% weight=99 blockId=hicbit_lineSensorValue block="Get line follower sensor Value|port %port|value(0~255)"
    export function hicbit_lineSensorValue(port: hicbit_Port): number {
        let ADCPin: AnalogPin;
        switch (port) {
            case hicbit_Port.port1:
                ADCPin = AnalogPin.P1;
                break;
            case hicbit_Port.port2:
                ADCPin = AnalogPin.P2;
                break;
            case hicbit_Port.port3:
                ADCPin = AnalogPin.P3;
                break;
            case hicbit_Port.port4:
                ADCPin = AnalogPin.P4;
                break;
        }
        let adValue = pins.analogReadPin(ADCPin);
        adValue = adValue * 255 / 1023;
        return Math.round(adValue);
    }

    let distanceBak = 0;
    /**
     * Get the distance of ultrasonic detection to the obstacle 超声波
     */
    //% weight=98 blockId=hicbit_ultrasonic  block="Ultrasonic|port %port|distance(cm)"
    export function hicbit_ultrasonic(port: hicbit_Port): number {
        let echoPin: DigitalPin;
        let trigPin: DigitalPin;
        switch (port) {
            case hicbit_Port.port1:
                echoPin = DigitalPin.P15;
                trigPin = DigitalPin.P1;
                break;
            case hicbit_Port.port2:
                echoPin = DigitalPin.P13;
                trigPin = DigitalPin.P2;
                break;
            case hicbit_Port.port3:
                echoPin = DigitalPin.P14;
                trigPin = DigitalPin.P3;
                break;
            case hicbit_Port.port4:
                echoPin = DigitalPin.P10;
                trigPin = DigitalPin.P4;
                break;
        }
        pins.setPull(echoPin, PinPullMode.PullNone);
        pins.setPull(trigPin, PinPullMode.PullNone);

        pins.digitalWritePin(trigPin, 0);
        control.waitMicros(2);
        pins.digitalWritePin(trigPin, 1);
        control.waitMicros(10);
        pins.digitalWritePin(trigPin, 0);
        control.waitMicros(5);
        let d = pins.pulseIn(echoPin, PulseValue.High, 25000);
        let distance = d;
        // filter timeout spikes
        if (distance == 0 && distanceBak != 0) {
            distance = distanceBak;
        }
        distanceBak = d;
        return Math.round(distance * 10 / 6 / 58);
    }

    /**
    * Get the ad value of the knob moudule 旋钮
    */
    //% weight=97 blockId=hicbit_getKnobValue  block="Get knob|port %port|value(0~255)"
    export function hicbit_getKnobValue(port: hicbit_Port): number {
        let ADCPin: AnalogPin;
        switch (port) {
            case hicbit_Port.port1:
                ADCPin = AnalogPin.P1;
                break;
            case hicbit_Port.port2:
                ADCPin = AnalogPin.P2;
                break;
            case hicbit_Port.port3:
                ADCPin = AnalogPin.P3;
                break;
            case hicbit_Port.port4:
                ADCPin = AnalogPin.P4;
                break;
        }
        let adValue = pins.analogReadPin(ADCPin);
        adValue = adValue * 255 / 1023;
        return Math.round(adValue);
    }

    /**
    * Get the ad value of the photosensitive moudule 光敏AD
    */
    //% weight=96 blockId=hicbit_getphotosensitiveValue  block="Get Photosensitive|port %port|value(0~255)"
    export function hicbit_getphotosensitiveValue(port: hicbit_Port): number {
        let ADCPin: AnalogPin;
        switch (port) {
            case hicbit_Port.port1:
                ADCPin = AnalogPin.P1;
                break;
            case hicbit_Port.port2:
                ADCPin = AnalogPin.P2;
                break;
            case hicbit_Port.port3:
                ADCPin = AnalogPin.P3;
                break;
            case hicbit_Port.port4:
                ADCPin = AnalogPin.P4;
                break;
        }
        let adValue = pins.analogReadPin(ADCPin);
        adValue = adValue * 255 / 1023;
        return 255 - Math.round(adValue);
    }

    /**
    * Get the Photosensitive sensor status,1 detect bright,0 no detect bright 光敏
    */
    //% weight=95 blockId=hicbit_photosensitiveSensor blockGap=50 block="Photosensitive sensor|port %port|detect bright"
    export function hicbit_photosensitiveSensor(port: hicbit_Port): boolean {
        let status = 0;
        let flag: boolean = false;
        switch (port) {
            case hicbit_Port.port1:
                pins.setPull(DigitalPin.P15, PinPullMode.PullUp);
                status = pins.digitalReadPin(DigitalPin.P15);
                break;
            case hicbit_Port.port2:
                pins.setPull(DigitalPin.P13, PinPullMode.PullUp);
                status = pins.digitalReadPin(DigitalPin.P13);
                break;
            case hicbit_Port.port3:
                pins.setPull(DigitalPin.P14, PinPullMode.PullUp);
                status = pins.digitalReadPin(DigitalPin.P14);
                break;
            case hicbit_Port.port4:
                pins.setPull(DigitalPin.P10, PinPullMode.PullUp);
                status = pins.digitalReadPin(DigitalPin.P10);
                break;
        }
        if (status == 1)
            flag = false;
        else
            flag = true;
        return flag;
    }

    /**
    * Get the ad value of the avoid Sensor moudule 避障AD
    */
    //% weight=94 blockId=hicbit_getavoidSensorValue  block="Get avoid Sensor Value|port %port|value(0~255)"
    export function hicbit_getavoidSensorValue(port: hicbit_Port): number {
        let ADCPin: AnalogPin;
        switch (port) {
            case hicbit_Port.port1:
                ADCPin = AnalogPin.P1;
                break;
            case hicbit_Port.port2:
                ADCPin = AnalogPin.P2;
                break;
            case hicbit_Port.port3:
                ADCPin = AnalogPin.P3;
                break;
            case hicbit_Port.port4:
                ADCPin = AnalogPin.P4;
                break;
        }
        let adValue = pins.analogReadPin(ADCPin);
        adValue = adValue * 255 / 1023;
        return Math.round(adValue);
    }

    /**
    * Get the obstacle avoidance sensor status,1 detect obstacle,0 no detect obstacle 避障判断
    */
    //% weight=93 blockId=hicbit_avoidSensor block="Obstacle avoidance sensor|port %port|detect obstacle"
    export function hicbit_avoidSensor(port: hicbit_Port): boolean {
        let status = 0;
        let flag: boolean = false;
        switch (port) {
            case hicbit_Port.port1:
                pins.setPull(DigitalPin.P15, PinPullMode.PullUp);
                status = pins.digitalReadPin(DigitalPin.P15);
                break;
            case hicbit_Port.port2:
                pins.setPull(DigitalPin.P13, PinPullMode.PullUp);
                status = pins.digitalReadPin(DigitalPin.P13);
                break;
            case hicbit_Port.port3:
                pins.setPull(DigitalPin.P14, PinPullMode.PullUp);
                status = pins.digitalReadPin(DigitalPin.P14);
                break;
                // if (P14_ad > 0xA)
                //     status = 1
                // else
                //     status = 0;
                // break;
            case hicbit_Port.port4:
                pins.setPull(DigitalPin.P10, PinPullMode.PullUp);
                status = pins.digitalReadPin(DigitalPin.P10);
                break;
        }
        if (status == 1)
            flag = false;
        else
            flag = true;
        return flag;
    }

    /**
    * Get the ad value of the Sound sensor moudule 声音AD
    */
    //% weight=92 blockId=hicbit_getSoundsensorValue  block="Get Sound sensor Value|port %port|value(0~255)"
    export function hicbit_getSoundsensorValue(port: hicbit_Port): number {
        let ADCPin: AnalogPin;
        switch (port) {
            case hicbit_Port.port1:
                ADCPin = AnalogPin.P1;
                break;
            case hicbit_Port.port2:
                ADCPin = AnalogPin.P2;
                break;
            case hicbit_Port.port3:
                ADCPin = AnalogPin.P3;
                break;
            case hicbit_Port.port4:
                ADCPin = AnalogPin.P4;
                break;
        }
        let adValue = pins.analogReadPin(ADCPin);
        adValue = adValue * 255 / 1023;
        return Math.round(adValue);
    }

    /**
    * Set the Sound sensor status,1 detect the sound source,0 no detect the sound source 声音
    */
    //% weight=91 blockId=hicbit_SoundSensor block="Set the Sound sensor|port %port|detect the sound source"
    export function hicbit_SoundSensor(port: hicbit_Port): boolean {
        let status = 0;
        let flag: boolean = false;
        switch (port) {
            case hicbit_Port.port1:
                pins.setPull(DigitalPin.P15, PinPullMode.PullUp);
                status = pins.digitalReadPin(DigitalPin.P15);
                break;
            case hicbit_Port.port2:
                pins.setPull(DigitalPin.P13, PinPullMode.PullUp);
                status = pins.digitalReadPin(DigitalPin.P13);
                break;
            case hicbit_Port.port3:
                pins.setPull(DigitalPin.P14, PinPullMode.PullUp);
                status = pins.digitalReadPin(DigitalPin.P14);
                break;
            case hicbit_Port.port4:
                pins.setPull(DigitalPin.P10, PinPullMode.PullUp);
                status = pins.digitalReadPin(DigitalPin.P10);
                break;
        }
        if (status == 1)
            flag = false;
        else
            flag = true;
        return flag;
    }

    /**
    * Get the collision sensor status,1 trigger,0 no trigger 碰撞
    */
    //% weight=90 blockId=hicbit_collisionsensor block="collision sensor|port %port|is trigger"    
    export function hicbit_collisionsensor(port: hicbit_Port): boolean {
        let status = 0;
        let flag: boolean = false;
        switch (port) {
            case hicbit_Port.port1:
                pins.setPull(DigitalPin.P15, PinPullMode.PullUp);
                status = pins.digitalReadPin(DigitalPin.P15);
                break;
            case hicbit_Port.port2:
                pins.setPull(DigitalPin.P13, PinPullMode.PullUp);
                status = pins.digitalReadPin(DigitalPin.P13);
                break;
            case hicbit_Port.port3:
                pins.setPull(DigitalPin.P14, PinPullMode.PullUp);
                status = pins.digitalReadPin(DigitalPin.P14);
                break;
            case hicbit_Port.port4:
                pins.setPull(DigitalPin.P10, PinPullMode.PullUp);
                status = pins.digitalReadPin(DigitalPin.P10);
                break;
        }
        if (status == 1)
            flag = false;
        else
            flag = true;
        return flag;
    }


    let lhRGBLight: hicbitRGBLight.LHhicbitRGBLight;
    /**
	 * Initialize Light belt
	 */
    //% weight=85 blockId=hicbit_initRGBLight block="Initialize light belt at port %port"
    export function hicbit_initRGBLight(port: hicbit_Port) {
        switch (port) {
            case hicbit_Port.port1:
                if (!lhRGBLight) {
                    lhRGBLight = hicbitRGBLight.create(DigitalPin.P15, 3, hicbitRGBPixelMode.RGB);
                }
                break;
            case hicbit_Port.port2:
                if (!lhRGBLight) {
                    lhRGBLight = hicbitRGBLight.create(DigitalPin.P13, 3, hicbitRGBPixelMode.RGB);
                }
                break;
            case hicbit_Port.port3:
                if (!lhRGBLight) {
                    lhRGBLight = hicbitRGBLight.create(DigitalPin.P14, 3, hicbitRGBPixelMode.RGB);
                }
                break;
            case hicbit_Port.port4:
                if (!lhRGBLight) {
                    lhRGBLight = hicbitRGBLight.create(DigitalPin.P10, 3, hicbitRGBPixelMode.RGB);
                }
                break;
        }
        hicbit_clearLight();
    }

    /**
         * Set the brightness of the strip. This flag only applies to future operation.
         * @param brightness a measure of LED brightness in 0-255. eg: 255
    */
    //% blockId="hicbit_setBrightness" block="set light brightness %brightness"
    //% weight=84
    export function hicbit_setBrightness(brightness: number): void {
        lhRGBLight.setBrightness(brightness);
    }

    /**
     * Set the color of the colored lights, after finished the setting please perform  the display of colored lights.
     */
    //% weight=83 blockId=hicbit_setPixelRGB block="Set light belt|%lightoffset|color to %rgb"
    export function hicbit_setPixelRGB(lightoffset: hicbitLightsBelt, rgb: hicbitRGBColors) {
        lhRGBLight.setPixelColor(lightoffset, rgb);
    }

    /**
     * Display the colored lights, and set the color of the colored lights to match the use. After setting the color of the colored lights, the color of the lights must be displayed.
     */
    //% weight=82 blockId=hicbit_showLight block="Show light belt"
    export function hicbit_showLight() {
        lhRGBLight.show();
    }

    /**
     * Clear the color of the colored lights and turn off the lights.
     */
    //% weight=81 blockGap=50 blockId=hicbit_clearLight block="Clear light"
    export function hicbit_clearLight() {
        lhRGBLight.clear();
    }

    let MESSAGE_HEAD: number = 0xff;
   /**
     * Perform tasks when the infrared receives the remote control code.
     */
    //% weight=89 blockId=hicbit_onQdee_remote_ir_pressed block="on remote-control|%code|pressed"
    export function hicbit_onQdee_remote_ir_pressed(code: IRKEY,body: Action) {
        control.onEvent(MESSAGE_HEAD,code,body);
     }

    /**
     * Determine the direction of remote sensing.
     */
    //% weight=88 blockId=hicbit_Rocker block="Rocker value %value"
    export function hicbit_Rocker( value: enRocker): boolean {
        let x = pins.analogReadPin(AnalogPin.P4);
        let y = pins.analogReadPin(AnalogPin.P10);
        let now_state = enRocker.Nostate;

        if (x < 100) // 上
        {
            // now_state = enRocker.Up;
            now_state = enRocker.Left;
        }
        else if (x > 900) //下
        {
            // now_state = enRocker.Down;
            now_state = enRocker.Right;
        }
        else  // 左右
        {
            if (y < 100) //右
            {
                // now_state = enRocker.Right;
                now_state = enRocker.Up;
            }
            else if (y > 900) //左
            {
                // now_state = enRocker.Left;
                now_state = enRocker.Down;
            }
        }
        if (now_state == value)
            return true;
        else
            return false;
    }

    /**
     * get dht11 temperature and humidity Value
     **/
    //% weight=87 blockId="hicbit_getDHT11value" block="DHT11 set port %port|get %dhtResult"
    export function hicbit_getDHT11value(port: hicbit_Port,dhtResult: Dht11Result): number {
        let dht11pin: DigitalPin;
        switch (port) {
            case hicbit_Port.port1:
                dht11pin = DigitalPin.P1;
                break;
            case hicbit_Port.port2:
                dht11pin = DigitalPin.P2;
                break;
            case hicbit_Port.port3:
                dht11pin = DigitalPin.P3;
                break;
            case hicbit_Port.port4:
                dht11pin = DigitalPin.P4;
                break;
        
        }
        pins.digitalWritePin(dht11pin, 0);
        basic.pause(18);
        let i = pins.digitalReadPin(dht11pin);
        pins.setPull(dht11pin, PinPullMode.PullUp);
        switch (dhtResult) {
            case 0:
                let dhtvalue1 = 0;
                let dhtcounter1 = 0;
                while (pins.digitalReadPin(dht11pin) == 1);
                while (pins.digitalReadPin(dht11pin) == 0);
                while (pins.digitalReadPin(dht11pin) == 1);
                for (let i = 0; i <= 32 - 1; i++) {
                    while (pins.digitalReadPin(dht11pin) == 0)
                        dhtcounter1 = 0;
                    while (pins.digitalReadPin(dht11pin) == 1) {
                        dhtcounter1 += 1;
                    }
                    if (i > 15) {
                        if (dhtcounter1 > 2) {
                            dhtvalue1 = dhtvalue1 + (1 << (31 - i));
                        }
                    }
                }
                return ((dhtvalue1 & 0x0000ff00) >> 8);
                break;
            case 1:
                while (pins.digitalReadPin(dht11pin) == 1);
                while (pins.digitalReadPin(dht11pin) == 0);
                while (pins.digitalReadPin(dht11pin) == 1);
                let dhtvalue = 0;
                let dhtcounter = 0;
                for (let i = 0; i <= 32 - 1; i++) {
                    while (pins.digitalReadPin(dht11pin) == 0)
                        dhtcounter = 0;
                    while (pins.digitalReadPin(dht11pin) == 1) {
                        dhtcounter += 1;
                    }
                    if (i > 15) {
                        if (dhtcounter > 2) {
                            dhtvalue = dhtvalue + (1 << (31 - i));
                        }
                    }
                }
                return Math.round((((dhtvalue & 0x0000ff00) >> 8) * 9 / 5) + 32);
                break;
            case 2:
                while (pins.digitalReadPin(dht11pin) == 1);
                while (pins.digitalReadPin(dht11pin) == 0);
                while (pins.digitalReadPin(dht11pin) == 1);

                let value = 0;
                let counter = 0;

                for (let i = 0; i <= 8 - 1; i++) {
                    while (pins.digitalReadPin(dht11pin) == 0)
                        counter = 0;
                    while (pins.digitalReadPin(dht11pin) == 1) {
                        counter += 1;
                    }
                    if (counter > 3) {
                        value = value + (1 << (7 - i));
                    }
                }
                return value;
            default:
                return 0;
        }
        
    }

}


/*
 Display package
*/
//% weight=8 icon="\uf212" color=#CC3333
namespace Display{

    export let NEW_LINE = "\r\n";

    export enum Linenum {
        //% block="first_line"
        first_line = 0x01,
        //% block="second_line"
        second_line = 0x02,
        //% block="Third_line"
        Third_line = 0x03,
        //% block="Fourth_line"
        Fourth_line = 0x04,
        //% block="Fifth_line"
        Fifth_line = 0x05,
        //% block="Sixth_line"
        Sixth_line = 0x06,
        //% block="Seventh_line"
        Seventh_line = 0x07,
        //% block="Eighth_line"
        Eighth_line = 0x08
    }

    export enum unit {
        //% block="m"
        m = 0x01,
        //% block="cm"
        cm = 0x02,
        //% block="mm"
        mm = 0x03,
        //% block="C"
        C = 0x04,
        //% block="F"
        F = 0x05,
        //% block="%"
        bf = 0x06,
        //% block="null1"
        null1 = 0x07
    }

    /**
     * Display initialization, please execute at boot time
    */
    //% weight=100 blockId=Hicbit_Display_Init block="Initialize hicbit Display"
    export function Hicbit_Display_Init() {
        serial.redirect(
            SerialPin.P8,
            SerialPin.P12,
            BaudRate.BaudRate115200);
        basic.pause(1000);
    }


    /**
        * Display clear
        */
    //% weight=99 blockId=Clearscreen block="Clear screen"
    export function Clearscreen(): void {
        let buf = pins.createBuffer(1);
        buf[0] = 9;
        serial.writeBuffer(buf);
        serial.writeString(NEW_LINE);
        // basic.pause(200);
    }

    /**
        * Display ultrasonic distance
        */
    //% weight=98 blockId=setDisplay block="Display %line |text: %text | value: %value| unit1: %unit1"
    export function setDisplay(line: Linenum, text: string, value: number = 0, unit1: unit): void {
        let num: number = 1;
        let text2: string = "   ";
        let buf = pins.createBuffer(1);
        switch (line) {
            case Linenum.first_line:
                num = 1;
                break;
            case Linenum.second_line:
                num = 2;
                break;
            case Linenum.Third_line:
                num = 3;
                break;
            case Linenum.Fourth_line:
                num = 4;
                break;
            case Linenum.Fifth_line:
                num = 5;
                break;
            case Linenum.Sixth_line:
                num = 6;
                break;
            case Linenum.Seventh_line:
                num = 7;
                break;
            case Linenum.Eighth_line:
                num = 8;
                break;
        }
        buf[0] = num;
        serial.writeBuffer(buf);
        if (!text) text = "";
        serial.writeString(text);
        serial.writeString(value.toString());
        switch (unit1) {
            case unit.m:
                text2 = "m";
                break;
            case unit.cm:
                text2 = "cm";
                break;
            case unit.mm:
                text2 = "mm";
                break;
            case unit.C:
                text2 = "C";
                break;
            case unit.F:
                text2 = "F";
                break;
            case unit.bf:
                text2 = "%";
                break;
            case unit.null1:
                text2 = " ";
                break;
            
        }
        serial.writeString(text2);
        serial.writeString(NEW_LINE);
        // basic.pause(200);
    }

}
