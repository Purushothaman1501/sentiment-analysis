
import tensorflow as tf
from keras.preprocessing.sequence import pad_sequences
import numpy as np
import pickle
import os
from django.conf import settings



# Global variables to hold model and tokenizer (Lazy Loading)
MODEL = None
TOKENIZER = None
LABEL_ENCODER = None
MAX_LEN = 100
CLASSES = ['negative', 'neutral', 'positive']

def get_model_artifacts():
    global MODEL, TOKENIZER, LABEL_ENCODER, CLASSES
    if MODEL is None:
        model_path = os.path.join(settings.BASE_DIR, 'senti_model', 'model.h5')
        tokenizer_path = os.path.join(settings.BASE_DIR, 'senti_model', 'tokenizer.pickle')
        le_path = os.path.join(settings.BASE_DIR, 'senti_model', 'label_encoder.pickle')

        try:
            if os.path.exists(model_path):
                MODEL = tf.keras.models.load_model(model_path)
            if os.path.exists(tokenizer_path):
                with open(tokenizer_path, 'rb') as h:
                    TOKENIZER = pickle.load(h)
            if os.path.exists(le_path):
                with open(le_path, 'rb') as h:
                    LABEL_ENCODER = pickle.load(h)
                    CLASSES = LABEL_ENCODER.classes_
        except Exception as e:
            print(f"Error loading sentiment model artifacts: {e}")
            
    return MODEL, TOKENIZER, CLASSES