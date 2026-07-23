VIA_ENABLE = yes
VIAL_ENABLE = yes
VIALRGB_ENABLE = yes
ENCODER_MAP_ENABLE = yes

# Разрешаем линковщику игнорировать ошибку "multiple definition" (двойное объявление функций).
# Это необходимо, так как кастомный беспроводной модуль MonsGeek (md_raw.c) 
# и системное ядро Vial (raw_hid.c) используют одинаковую функцию replaced_hid_send.
# С этим флагом компилятор просто выберет приоритетную функцию модуля и соберет прошивку.
LDFLAGS += -Wl,--allow-multiple-definition