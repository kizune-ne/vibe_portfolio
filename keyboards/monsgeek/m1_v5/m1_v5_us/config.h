// Copyright 2024 yangzheng20003 (@yangzheng20003)
// SPDX-License-Identifier: GPL-2.0-or-later

#pragma once

#define USB_POWER_EN_PIN                    B1 // USB ENABLE pin
#define LED_POWER_EN_PIN                    A5 // LED ENABLE pin
#define HS_BAT_CABLE_PIN                    A7 // USB insertion detection pin
#define HS_LED_BOOSTING_PIN                 D2 // LED BOOSTING

#define BAT_FULL_PIN                        A15
#define BAT_FULL_STATE                      1

#define HS_RGB_INDICATOR_COUNT              99
#define HS_RGB_BAT_COUNT                    81

#define MD_BT1_NAME                         "M1 V5"
#define MD_BT2_NAME                         "M1 V5"
#define MD_BT3_NAME                         "M1 V5"
#define MD_DONGLE_PRODUCT                   "M1 V5"

/* Device Connection RGB Indicator Light Index And Color */
#define HS_RGB_BLINK_INDEX_BT1              48
#define HS_RGB_BLINK_INDEX_BT2              47
#define HS_RGB_BLINK_INDEX_BT3              46
#define HS_RGB_BLINK_INDEX_2G4              45
#define HS_RGB_BLINK_INDEX_USB              44

#define HS_LBACK_COLOR_BT1                  RGB_BLUE
#define HS_LBACK_COLOR_BT2                  RGB_BLUE
#define HS_LBACK_COLOR_BT3                  RGB_BLUE
#define HS_LBACK_COLOR_2G4                  RGB_RED
#define HS_LBACK_COLOR_USB                  RGB_WHITE

#define HS_PAIR_COLOR_BT1                   RGB_BLUE
#define HS_PAIR_COLOR_BT2                   RGB_BLUE
#define HS_PAIR_COLOR_BT3                   RGB_BLUE
#define HS_PAIR_COLOR_2G4                   RGB_RED
#define HS_PAIR_COLOR_USB                   RGB_WHITE

/* Battery */
#define BATTERY_CAPACITY_LOW                20 //порог низкого заряда
#define BATTERY_CAPACITY_STOP               0
#define RGB_MATRIX_BAT_INDEX_MAP            {25, 26, 27, 28, 29, 30, 31, 32, 33, 34}

/* Status Indicator Lamp */
#define HS_MATRIX_BLINK_INDEX_BAT           81
#define HS_RGB_INDEX_CAPS                   52
#define HS_RGB_INDEX_WIN_LOCK               79

#define HS_RGB_BLINK_INDEX_WIN              53
#define HS_RGB_BLINK_INDEX_MAC              54

#define SYSTEM_WIN_PIN                      C15
#define SYSTEM_MAC_PIN                      C14

/* UART */
#define SERIAL_DRIVER                       SD3
#define SD1_TX_PIN                          C10
#define SD1_RX_PIN                          C11

// [Vial-Porting] Алиасы для драйверов UART в старой версии QMK (vial-qmk)
#define UART_DRIVER                         SERIAL_DRIVER
#define UART_TX_PIN                         SD1_TX_PIN
#define UART_RX_PIN                         SD1_RX_PIN
#define UART_RX_PAL_MODE                    7  // ИСПРАВЛЕНО: Правильный режим AF7 для UART!

/* Encoder */
#define ENCODER_MAP_KEY_DELAY               1

/* SPI */
#define SPI_DRIVER                          SPIDQ
#define SPI_SCK_PIN                         B3
#define SPI_MOSI_PIN                        B5
#define SPI_MISO_PIN                        B4

/* Flash */
#define EXTERNAL_FLASH_SPI_SLAVE_SELECT_PIN C12

// [Vial-Porting] Увеличиваем общий объем EEPROM с 2048 до 4096 байт
#undef WEAR_LEVELING_BACKING_SIZE
#define WEAR_LEVELING_BACKING_SIZE          8192

#undef WEAR_LEVELING_LOGICAL_SIZE
#define WEAR_LEVELING_LOGICAL_SIZE          4096

// ИСПРАВЛЕНО: Явно снимаем системную блокировку ядра QMK. 
// Устанавливаем 3356, чтобы оставить место (740 байт) для системных данных клавиатуры.
#define EEPROM_SIZE                         3356

/* RGB Matrix */
#define RGB_MATRIX_FRAMEBUFFER_EFFECTS
#define RGB_MATRIX_KEYPRESSES

/* WS2812 */
#define WS2812_SPI_DRIVER  SPIDM2
#define WS2812_SPI_DIVISOR 32

/* rgb_record */
#define ENABLE_RGB_MATRIX_RGBR_PLAY
#define RGBREC_CHANNEL_NUM         4
#define EECONFIG_CONFINFO_USE_SIZE (4 + 16)
#define EECONFIG_RGBREC_USE_SIZE   (RGBREC_CHANNEL_NUM * MATRIX_ROWS * MATRIX_COLS * 2)
#define EECONFIG_USER_DATA_SIZE    (EECONFIG_RGBREC_USE_SIZE + EECONFIG_CONFINFO_USE_SIZE)

// [Vial-Porting] Сдвигаем системные данные в самый конец 4096-байтного блока,
// чтобы Vial (который думает, что размер EEPROM равен 3356) никогда их не затер.
#define MY_EECONFIG_USER_DATABLOCK    3356
#define RGBREC_EECONFIG_ADDR       (uint8_t *)(MY_EECONFIG_USER_DATABLOCK)
#define CONFINFO_EECONFIG_ADDR     (uint32_t *)((uint32_t)RGBREC_EECONFIG_ADDR + (uint32_t)EECONFIG_RGBREC_USE_SIZE)

/* Отключаем отключение дата-линий USB при простое от Windows */
#define NO_SUSPEND_POWER_DOWN