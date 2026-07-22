// Copyright 2024 QMK
// SPDX-License-Identifier: GPL-2.0-or-later

#pragma once

#define RENAME_WITH_LINE(A, B) COMBINE(A, B)
#define COMBINE(A, B) A##B
#define raw_hid_send(a, b) RENAME_WITH_LINE(_temp_rhs_, __LINE__)(a, b)
#define _temp_rhs_29 replaced_hid_send  // raw_hid.h
#define _temp_rhs_461 replaced_hid_send // via.c (qmk_clean)
#define _temp_rhs_442 replaced_hid_send // via.c (vial-qmk)
#define _temp_rhs_466 replaced_hid_send // via.c (vial-qmk)

// TODO(workaround): Перенаправление raw_hid_send в replaced_hid_send через макросы на основе номеров строк __LINE__.
// ПОЧЕМУ: Стандартное переопределение конфликтует с внутренним вызовом в raw_hid.c. В vial-qmk номера строк вызовов в via.c отличаются от qmk_clean.
// СОГЛАСОВАНО: Пользователем - 06.07.2026
// КАК ИСПРАВИТЬ ПРАВИЛЬНО: Переписать архитектуру перехвата HID-пакетов без привязки к __LINE__, например, через weak-линковку или явную условную компиляцию в via.c.
