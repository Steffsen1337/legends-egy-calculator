// data/uniques_data.js
const UNIQUES_DATA = [
    // ——— 30 min ———
    { name: "Mangyang", level: 10, intervalMinutes: 30 },
    { name: "Movia", level: 10, intervalMinutes: 30 },

    // ——— 1 h ———
    { name: "Tiger Girl", level: 20, intervalMinutes: 60 },
    { name: "Cerberus", level: 24, intervalMinutes: 60 },

    // ——— 2 h ———
    { name: "Tai-Sui", level: 30, intervalMinutes: 120 },
    { name: "Captain Ivy", level: 30, intervalMinutes: 120 },

    // ——— 3 h ———
    { name: "Uruchi", level: 40, intervalMinutes: 180 },
    { name: "Goria", level: 40, intervalMinutes: 180 },

    // ——— 3.5 h ———
    { name: "Taishan", level: 50, intervalMinutes: 210 },

    // ——— 4 h ———
    { name: "Isyutaru", level: 60, intervalMinutes: 240 },

    // ——— 4.5 h ———
    { name: "Desert Scorpion", level: 70, intervalMinutes: 270 },

    // ——— 5 h ———
    { name: "Lord Yarkan", level: 80, intervalMinutes: 300 },

    // ——— 5.5 h ———
    { name: "Demon Shaitan", level: 90, intervalMinutes: 330 },

    // ——— 6 h ———
    { name: "Tomb General Hyun", level: 85, intervalMinutes: 360 },
    { name: "Tomb General Bi", level: 88, intervalMinutes: 360 },
    { name: "Tomb General Ho", level: 89, intervalMinutes: 360 },
    { name: "Tomb General Jin", level: 90, intervalMinutes: 360 },
    { name: "Sand Monster [STR]", level: 106, intervalMinutes: 360 },
    { name: "Sand Monster [INT]", level: 106, intervalMinutes: 360 },

    // ——— 6.5 h ———
    { name: "Sylph Wind Element [INT]", level: 100, intervalMinutes: 390 },
    { name: "Undine Water Element [INT]", level: 100, intervalMinutes: 390 },
    { name: "Salamander Fire Element [STR]", level: 100, intervalMinutes: 390 },
    { name: "Gnome Earth Element [STR]", level: 100, intervalMinutes: 390 },

    // ——— 7 h ———
    { name: "Jung Snake General [INT]", level: 100, intervalMinutes: 420 },
    { name: "Hew Snake General [STR]", level: 100, intervalMinutes: 420 },
    { name: "Yul Snake General [STR]", level: 100, intervalMinutes: 420 },
    { name: "Ki Snake General [INT]", level: 100, intervalMinutes: 420 },

    // ——— 7.5 h ———
    { name: "Soso The Black Viper", level: 100, intervalMinutes: 450 },
    { name: "SoSo The Black Viper [STR]", level: 100, intervalMinutes: 450 },

    // ——— 8 h ———
    { name: "Ancient Librarian", level: 105, intervalMinutes: 480 },

    // ——— 8.5 h ———
    { name: "Lost Pharaoh", level: 107, intervalMinutes: 510 },

    // ——— 9 h ———
    { name: "Sphinx (STR)", level: 107, intervalMinutes: 540 },
    { name: "Sphinx (INT)", level: 107, intervalMinutes: 540 },

    // ——— 9.5 h ———
    { name: "Desert Beast [STR]", level: 108, intervalMinutes: 570 },
    { name: "Desert Beast [INT]", level: 108, intervalMinutes: 570 },

    // ——— 10 h ———
    { name: "Salt Desert Demon", level: 108, intervalMinutes: 600 },

    // ——— Spezialfall: Apis – Spawn every 3‑6 Stunden ———
    { 
        name: "Apis", 
        level: 105, 
        intervalMinutes: null,         // kein fester Wert
        intervalMin: 180,              // 3 h in min
        intervalMax: 360               // 6 h in min
    }
];