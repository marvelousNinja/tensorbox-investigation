FROM tensorflow/tensorflow:latest-gpu

MAINTAINER alexander.sologub@altoros.com

RUN apt-get update -y && \
    apt-get install -y git wget && \
    git clone http://github.com/russell91/tensorbox && \
    cd tensorbox && \
    cd utils && \
    make && \
    pip install opencv-python

RUN cd tensorbox && \
    mkdir -p data && cd data && \
    wget --continue http://russellsstewart.com/s/tensorbox/inception_v1.ckpt && \
    wget --continue http://download.tensorflow.org/models/resnet_v1_101_2016_08_28.tar.gz && \
    mkdir -p overfeat_rezoom && cd overfeat_rezoom && \
    wget --continue http://russellsstewart.com/s/tensorbox/overfeat_rezoom/save.ckpt-150000v2 && \
    cd .. && \
    tar xf resnet_v1_101_2016_08_28.tar.gz
