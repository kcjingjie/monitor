package com.zynly.monitor;
import com.zynly.monitor.utils.Capture2;
import com.zynly.monitor.utils.CapturePic;
import org.bytedeco.javacv.FrameGrabber;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.IOException;

@SpringBootApplication
public class MonitorApplication {

    public static void main(String[] args) {
        /*SpringApplication.run(MonitorApplication.class, args);
        CapturePic capturePic = new CapturePic();
        try {
            try {
                capturePic.fetchPic();
            } catch (IOException e) {
                e.printStackTrace();
            }
        } catch (FrameGrabber.Exception e) {
            e.printStackTrace();
        }*/
       /* String inputFile = "rtmp://58.200.131.2:1935/livetv/hunantv";
        // Decodes-encodes
        String outputFile = "recorde.jpg";
        try {
            Capture2.frameRecord(inputFile, outputFile,1);
        } catch (Exception e) {
            e.printStackTrace();
        }*/
        try {
            Capture2.getFile();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}
