document.addEventListener("DOMContentLoaded", (event) => {
    Cinput1 = document.getElementById('Cinput1');
    Cinput2 = document.getElementById('Cinput2');
    Cinput3 = document.getElementById('Cinput3');
    IGNinput = document.getElementById('input');
    PreviewText = document.getElementById('preview');
    colorCountDropdown = document.getElementById('colorCount');
    C2label = document.getElementById('Cinput2label');
    C3label = document.getElementById('Cinput3label');
    nickOutput = document.getElementById('output1');
    outputField2 = document.getElementById('output2');

    document.getElementById('import').addEventListener('click', function () {
        const miniMessage = prompt('Please enter your MiniMessage:');
        if (miniMessage) {
            processMiniMessage(miniMessage);
        } else {
            alert('No MiniMessage was entered!');
        }
    });

    // Add event listeners to inputs
    Cinput1.addEventListener('input', updateIGN);
    Cinput2.addEventListener('input', updateIGN);
    Cinput3.addEventListener('input', updateIGN);
    colorCountDropdown.addEventListener('change', updateColorInputs);
    IGNinput.addEventListener('input', updateIGN);

    updateColorInputs(); // Initialize the color inputs based on the default selection
    updateIGN(); // Initialize the background colors
});

function formatHexColor(color) {
    color = color.replace('#', ''); // Entfernt das `#`, falls vorhanden
    if (color.length === 6) {
        return `#${color}`; // Fügt das `#` wieder hinzu
    } else if (color.length === 3) {
        // Falls die Farbe in der Kurzform (z.B. `#abc`) angegeben wurde, erweitern
        return `#${color.split('').map(char => char + char).join('')}`;
    } else {
        return '#ffffff'; // Fallback auf weiß, wenn die Länge nicht stimmt
    }
}

function updateBg() {
    const color1 = formatHexColor(Cinput1.value);
    const color2 = formatHexColor(Cinput2.value);
    const color3 = formatHexColor(Cinput3.value);
    
    Cinput1.style.backgroundColor = color1 === '#ffffff' ? 'transparent' : color1;
    Cinput2.style.backgroundColor = color2 === '#ffffff' ? 'transparent' : color2;
    Cinput3.style.backgroundColor = color3 === '#ffffff' ? 'transparent' : color3;

    updateMiniMessageOutput(color1, color2, color3);
    updateIGN(); // Update when new color
}

function updateColorInputs() {
    const selectedColorCount = colorCountDropdown.value;
    
    if (selectedColorCount == 1) {
        C2label.style.display = 'none';
        Cinput2.style.display = 'none';
        C3label.style.display = 'none';
        Cinput3.style.display = 'none';
    } else if (selectedColorCount == 2) {
        C2label.style.display = 'block';
        Cinput2.style.display = 'block';
        C3label.style.display = 'none';
        Cinput3.style.display = 'none';
    } else {
        C2label.style.display = 'block';
        Cinput2.style.display = 'block';
        C3label.style.display = 'block';
        Cinput3.style.display = 'block';
    }

    updateIGN(); // Update the preview whenever the color count changes
}

function updateIGN() {
    PreviewText.innerHTML = "";
    const selectedColorCount = parseInt(colorCountDropdown.value);
    const color1 = formatHexColor(Cinput1.value);
    const color2 = selectedColorCount >= 2 ? formatHexColor(Cinput2.value) : color1;
    const color3 = selectedColorCount === 3 ? formatHexColor(Cinput3.value) : color2;
    const IGN = IGNinput.value || 'Nickname';

    const gradientColors = getGradientColors([color1, color2, color3], IGN.length);

    for (let i = 0; i < IGN.length; i++) {
        const char = IGN.charAt(i);
        const span = document.createElement('span');
        span.innerHTML = char;
        span.style.color = gradientColors[i];
        PreviewText.appendChild(span);
    }

    // Update the /nick output field
    updateNickOutput(color1, color2, color3);
    updateMiniMessageOutput(color1, color2, color3);
}

function processMiniMessage(miniMessage) {
    // Regex für Gradient mit 1 bis 3 Farben
    const gradientPattern = /<gradient:(#[0-9a-fA-F]{6}):(#?[0-9a-fA-F]{6})>(.*?)<\/gradient>/g;
    const colorPattern = /<color:(#[0-9a-fA-F]{6})>(.*?)<\/color>/g;

    const gradients = [...miniMessage.matchAll(gradientPattern)];
    const colors = [...miniMessage.matchAll(colorPattern)];

    let ign = '';
    let colorList = [];

    if (gradients.length > 0) {
        gradients.forEach((match) => {
            ign += match[3];
            colorList.push(formatHexColor(match[1]), formatHexColor(match[2]));
        });

        // Entferne Duplikate und setze die Farben
        colorList = [...new Set(colorList)].filter(Boolean);

        // Setze die Eingabefelder basierend auf der MiniMessage
        IGNinput.value = ign;
        colorCountDropdown.value = colorList.length;

        Cinput1.value = colorList[0] || '#ffffff';
        if (colorList.length > 1) {
            Cinput2.value = colorList[1] || '#ffffff';
            Cinput2.style.display = 'block';
            C2label.style.display = 'block';
        } else {
            Cinput2.style.display = 'none';
            C2label.style.display = 'none';
        }

        if (colorList.length > 2) {
            Cinput3.value = colorList[2] || '#ffffff';
            Cinput3.style.display = 'block';
            C3label.style.display = 'block';
        } else {
            Cinput3.style.display = 'none';
            C3label.style.display = 'none';
        }

        // Setze das Ausgabefeld für MiniMessage
        outputField2.value = miniMessage;
        
        // Aktualisiere andere Teile der UI
        updateColorInputs();
        updateBg();
    } else if (colors.length > 0) {
        // Wenn kein Gradient erkannt wird, prüfe auf Farbe
        const ign = colors.map(match => match[2]).join('');
        const color1 = formatHexColor(colors[0][1]);
        
        // Setze die Eingabefelder basierend auf der MiniMessage
        IGNinput.value = ign;
        colorCountDropdown.value = 1;
        Cinput1.value = color1;
        Cinput2.style.display = 'none';
        C2label.style.display = 'none';
        Cinput3.style.display = 'none';
        C3label.style.display = 'none';

        // Setze das Ausgabefeld für MiniMessage
        outputField2.value = miniMessage;
        
        // Aktualisiere andere Teile der UI
        updateColorInputs();
        updateBg();
    } else {
        alert('Invalid MiniMessage format!');
    }
}

function getGradientColors(colors, steps) {
    const gradientColors = [];
    const stepFactor = 1 / (steps - 1);
    let interpolatedColor;

    for (let i = 0; i < steps; i++) {
        let t = i * stepFactor;
        if (t <= 0.5) {
            interpolatedColor = interpolateColor(colors[0], colors[1], t * 2);
        } else {
            interpolatedColor = interpolateColor(colors[1], colors[2], (t - 0.5) * 2);
        }
        gradientColors.push(interpolatedColor);
    }

    return gradientColors;
}

function interpolateColor(color1, color2, factor) {
    const result = color1.slice(1).match(/.{2}/g)
        .map((hex, index) => {
            return Math.round(parseInt(hex, 16) * (1 - factor) +
                parseInt(color2.slice(1).match(/.{2}/g)[index], 16) * factor);
        });

    return `#${result.map(value => value.toString(16).padStart(2, '0')).join('')}`;
}

function updateNickOutput(color1, color2, color3) {
    const selectedColorCount = parseInt(colorCountDropdown.value);
    const IGN = IGNinput.value || 'Nickname';

    let nickCommand = `/nick color ${color1}`;

    if (selectedColorCount >= 2) {
        nickCommand += ` ${color2}`;
    }
    
    if (selectedColorCount === 3) {
        nickCommand += ` ${color3}`;
    }

    nickOutput.value = nickCommand;
}

function updateMiniMessageOutput(color1, color2, color3) {
    const IGN = IGNinput.value || 'Nickname';
    let formattedMessage = '';

    if (colorCountDropdown.value === "1") {
        formattedMessage = `<color:${color1}>${IGN}</color>`;
    }
    else if (colorCountDropdown.value === "2") {
        formattedMessage = `<gradient:${color1}:${color2}>${IGN}</gradient>`;
    }
    else if (colorCountDropdown.value === "3") {
        formattedMessage = `<gradient:${color1}:${color2}:${color3}>${IGN}</gradient>`;
    }

    outputField2.value = formattedMessage;
}

// Add the copy functionality
function copyToClipboard() {
    nickOutput.select();
    document.execCommand('copy');
}

// Add event listener for copying
nickOutput.addEventListener('click', copyToClipboard);
