package com.zynly.monitor.utils;

import org.bytedeco.javacv.FFmpegFrameGrabber;
import org.bytedeco.javacv.Frame;
import org.bytedeco.javacv.FrameGrabber;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

/**
 * 截取视频截图
 */
public class CapturePic {

    public void fetchPic() throws FrameGrabber.Exception, IOException {
      /*  FFmpegFrameGrabber ff = new FFmpegFrameGrabber("rtmp://58.200.131.2:1935/livetv/hunantv");
        ff.start();
        int length = ff.getLengthInFrames();
        int i = 0;
        Frame f = null;
        while(i<length) {
            //过滤前5贞
            f = ff.grabFrame();
            if ((i>5)&&(f.image !=null)){
                break;
            }
            i++;
        }
        IplImage image = f.image;
        int owidth = image.width();
        int oheight = image.height();
        *//*对截取的帧进行等比例缩放*//*
        int width = 800;
        int height = (int)(((double)width/owidth)*oheight);
        BufferedImage bi = new BufferedImage(width, height, BufferedImage.TYPE_3BYTE_BGR);
        bi.getGraphics().drawImage(f.image.getBufferedImage().getScaledInstance(width, height,Image.SCALE_SMOOTH),0, 0, null);
        File targetFile = new File("D:/test.jpg");

        ImageIO.write(bi, "jpg",targetFile);*/

    }


}
