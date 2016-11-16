//
//  myWindow.m
//  JpushCordova
//
//  Created by yuaixia on 16/11/14.
//
//

#import "myWindow.h"

@implementation myWindow

/*
// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.
- (void)drawRect:(CGRect)rect {
    // Drawing code
}
*/

- (void)setHight{
    self.hidden = NO;
    self.alpha = 1.0f;
    self.frame = [UIApplication sharedApplication].statusBarFrame;
}

@end
