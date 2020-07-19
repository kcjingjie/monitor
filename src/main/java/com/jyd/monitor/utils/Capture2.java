package com.jyd.monitor.utils;

import org.bytedeco.javacv.*;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

public class Capture2 {
    /**
     * 按帧录制视频
     *
     * @param inputFile-该地址可以是网络直播/录播地址，也可以是远程/本地文件路径
     * @param outputFile
     *            -该地址只能是文件地址，如果使用该方法推送流媒体服务器会报错，原因是没有设置编码格式
     * @throws FrameGrabber.Exception
     * @throws FrameRecorder.Exception
     * @throws org.bytedeco.javacv.FrameRecorder.Exception
     */
    public static void frameRecord(String inputFile, String outputFile, int audioChannel)
            throws Exception, org.bytedeco.javacv.FrameRecorder.Exception {

        boolean isStart=true;//该变量建议设置为全局控制变量，用于控制录制结束
        // 获取视频源
        FFmpegFrameGrabber grabber = new FFmpegFrameGrabber(inputFile);
        // 流媒体输出地址，分辨率（长，高），是否录制音频（0:不录制/1:录制）
        FFmpegFrameRecorder recorder = new FFmpegFrameRecorder(outputFile, 1280, 720, audioChannel);
        // 开始取视频源
        recordByFrame(grabber, recorder, isStart);
    }
    private static void recordByFrame(FFmpegFrameGrabber grabber, FFmpegFrameRecorder recorder, Boolean status)
            throws Exception, org.bytedeco.javacv.FrameRecorder.Exception {
        try {//建议在线程中使用该方法
            grabber.start();
            recorder.start();
            Frame frame = null;
            while (status&& (frame = grabber.grabFrame()) != null) {
                recorder.record(frame);
            }
            recorder.stop();
            grabber.stop();
        } finally {
            if (grabber != null) {
                grabber.stop();
            }
        }
    }

    public static void getFile() throws IOException {
        FFmpegFrameGrabber frameGrabber = new FFmpegFrameGrabber("http://live.hkstv.hk.lxdns.com/live/hks/playlist.m3u8");

      /*  frameGrabber.setFrameRate(100);
        frameGrabber.setFormat("h264");
        frameGrabber.setVideoBitrate(15);
        frameGrabber.setVideoOption("preset", "ultrafast");
        frameGrabber.setNumBuffers(25000000);*/

        Java2DFrameConverter converter = new Java2DFrameConverter();

        try {
            frameGrabber.start();
        } catch (FrameGrabber.Exception e) {
            e.printStackTrace();
        }

        Frame frame = null;
        try {
            frame = frameGrabber.grab();
        } catch (FrameGrabber.Exception e) {
            e.printStackTrace();
        }
        BufferedImage bufferedImage = converter.convert(frame);
        File file = new File("D:/TEST.jpg");
        ImageIO.write(bufferedImage, "jpg", file);
        /*baos.flush();
        baos.close();*/
    }
    public static void getFile2() throws IOException {
        FFmpegFrameGrabber grabber = new FFmpegFrameGrabber("rtmp://58.200.131.2:1935/livetv/hunantv");
// 增加超时参数
        while(true) {
            Frame frame = grabber.grabImage();
            // ...
            Java2DFrameConverter converter = new Java2DFrameConverter();

            if (frame!=null){
                BufferedImage bufferedImage = converter.convert(frame);
                File file = new File("D:/TEST3.jpg");
                ImageIO.write(bufferedImage, "jpg", file);
            }
        }

    }




}
