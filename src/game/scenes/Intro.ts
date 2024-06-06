import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import Typed from 'typed.js';

function loadGoogleFont() {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
}

function addGlobalStyles() {
    const style = document.createElement('style');
    style.textContent = `
    @keyframes fade-in {
        0% { opacity: 0; }
        100% { opacity: 1; }
    }

    @keyframes fade-out {
        0% { opacity: 1; }
        100% { opacity: 0; }
    }
    @keyframes hover-shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
        20%, 40%, 60%, 80% { transform: translateX(2px); }
    }
    .selection-button:hover {  
        animation: hover-shake 0.5s;
    }
    .char-image {
        width: 200px;
        margin: 0 10px;
        cursor: pointer;
        // transition: transform 0.3s ease-in-out;
    }

    .char-image:hover {
        background-color: rgba(255, 255, 255, 0.15); 
    }

    .char-image.highlight {
        background-color: rgba(255, 255, 255, 0.3); /* Adjust the alpha value to change opacity */
    }    

    .weapon-image:hover {
        animation: hover-shake 0.4s;
    }    
    
    `;
    document.head.appendChild(style);
}

export class Intro extends Scene {
    constructor() {
        super('Intro');
    }

    preload() {
        this.load.image('background', 'assets/Intro/Company.png'); // Load the background image
    }

    create() {
        loadGoogleFont();
        addGlobalStyles();

        this.cameras.main.setBackgroundColor('#000000');

        EventBus.emit('current-scene-ready', this);

        setTimeout(() => {
            this.showScreenCharacter();
        }, 1000);
    }

    showScreen1() {
        this.cleanup();
    
        const screenDiv = document.createElement('div');
        screenDiv.id = 'screen1';
        screenDiv.style.position = 'fixed';
        screenDiv.style.top = '50%';
        screenDiv.style.left = '50%';
        screenDiv.style.transform = 'translate(-50%, -50%)';
        screenDiv.style.backgroundImage = 'url("assets/Intro/Company.png")';
        screenDiv.style.backgroundSize = '35% 10%'; 
        screenDiv.style.backgroundRepeat = 'no-repeat'; 
        screenDiv.style.backgroundPosition = 'center';
        screenDiv.style.width = '100%'; 
        screenDiv.style.height = '100%'; 
        screenDiv.style.border = 'none';
        screenDiv.style.boxShadow = 'none';
        screenDiv.style.opacity = '0'; 
        document.body.appendChild(screenDiv);
    
        screenDiv.style.animation = 'fade-in 1s forwards';
    
        setTimeout(() => {
            screenDiv.style.animation = 'fade-out 1s forwards';
    
            setTimeout(() => {
                this.cleanup();
                this.showScreen2();
            }, 1000); 
        }, 3000); 
    }
    
    showScreen2() {
        this.cleanup();
    
        const imagePaths = ['assets/Intro/n1.png', 'assets/Intro/n2.png', 'assets/Intro/n3.png'];
    
        const images: Phaser.GameObjects.Image[] = [];
        const imageGroup = this.add.group();
    
        imagePaths.forEach((path, index) => {
            this.load.image(`newspaper${index + 1}`, path);
        });
    
        this.load.on('complete', () => {
            imagePaths.forEach((path, index) => {
                let offsetX = 0;
                if (index === 0) {
                    offsetX = -75; 
                } else if (index === 1) {
                    offsetX = 75; 
                }
                const image = this.add.image(this.cameras.main.centerX + offsetX, this.cameras.main.centerY, `newspaper${index + 1}`);
                image.setOrigin(0.5);
                image.setScale(0.2); 
                image.setAlpha(0); 
                images.push(image);
                imageGroup.add(image);
            });
    
            images.forEach((image, index) => {
                this.tweens.add({
                    targets: image,
                    alpha: 1,
                    duration: 1000,
                    delay: index * 1000, 
                    onComplete: () => {
                        if (index === images.length - 1) {
                            setTimeout(() => {
                                this.tweens.add({
                                    targets: images,
                                    x: this.cameras.main.width + 100,
                                    y: -100,
                                    duration: 1000,
                                    onComplete: () => {
                                        this.cleanup();
                                        this.showScreen3();
                                    },
                                });
                            }, 500); 
                        }
                    },
                });
            });
        });
    
        this.load.start();
    }
    
    showScreen3() {
        this.cleanup();
    
        const screenDiv = document.createElement('div');
        screenDiv.id = 'screen3';
        screenDiv.style.position = 'fixed';
        screenDiv.style.top = '50%';
        screenDiv.style.left = '50%';
        screenDiv.style.transform = 'translate(-50%, -50%)';
        screenDiv.style.backgroundImage = 'url("assets/Intro/heh2.png")';
        screenDiv.style.backgroundSize = '90%'; // Adjust the size here
        screenDiv.style.backgroundRepeat = 'no-repeat'; // Prevent the image from repeating
        screenDiv.style.backgroundPosition = 'center'; // Center the image within the div
        screenDiv.style.width = '78%'; // Set the specific width
        screenDiv.style.height = '100%'; // Set the specific height
        screenDiv.style.border = 'none';
        screenDiv.style.boxShadow = 'none';
        screenDiv.style.opacity = '0'; 
        document.body.appendChild(screenDiv);
    
        // Create and style the vignette overlay
        const vignetteOverlay = document.createElement('div');
        vignetteOverlay.style.position = 'absolute';
        vignetteOverlay.style.top = '0';
        vignetteOverlay.style.left = '0';
        vignetteOverlay.style.width = '100%';
        vignetteOverlay.style.height = '100%';
        vignetteOverlay.style.pointerEvents = 'none';
        vignetteOverlay.style.zIndex = '10'; // Make sure it is above other elements
        vignetteOverlay.style.background = 'radial-gradient(circle, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.8) 100%)';
        screenDiv.appendChild(vignetteOverlay);
    
        const createButton = (text:any, id:any, top:any, onClick:any, imagePath:any) => {
            const button = document.createElement('button');
            button.id = id;
            button.innerText = text;
            button.style.position = 'absolute';
            button.style.top = top;
            button.style.padding = '12px';
            button.style.backgroundImage = `url("${imagePath}")`;
            button.style.backgroundSize = 'cover';
            button.style.backgroundRepeat = 'no-repeat';
            button.style.fontFamily = '"Press Start 2P", Arial, sans-serif';
            button.style.color = 'white';
            button.style.cursor = 'pointer';
            button.style.fontSize = '14px';
            button.style.width = '250px';
            button.style.height = '70px';
            button.classList.add('selection-button');
            button.style.imageRendering = 'pixelated';
            button.addEventListener('click', onClick);
            screenDiv.appendChild(button);
        };
    
        const startButtonLeft = '38%';
        const settingsButtonLeft = '40%'; 
        const creditsButtonLeft = '38%';
    
        createButton('Start', 'startButton', '48%', () => this.showScreenCharacter(), 'assets/Intro/buttons.png');
        const startButton = document.getElementById('startButton');
        if (startButton) {
            startButton.style.left = startButtonLeft;
        }   
        createButton('Settings', 'settingsButton', '58%', () => console.log('Settings clicked'), 'assets/Intro/buttons.png');
        const settingsButton = document.getElementById('settingsButton');
        if (settingsButton) {
            settingsButton.style.left = settingsButtonLeft;
        }    
        createButton('Credits', 'creditsButton', '68%', () => console.log('Credits clicked'), 'assets/Intro/buttons.png');
        const creditsButton = document.getElementById('creditsButton');
        if (creditsButton) {
            creditsButton.style.left = creditsButtonLeft;
        }    
        screenDiv.style.animation = 'fade-in 1s forwards';
    }

    showScreenCharacter() {
        this.cleanup();
    
        const screenDiv = document.createElement('div');
        screenDiv.id = 'showScreenCharacter';
        screenDiv.style.position = 'fixed';
        screenDiv.style.top = '50%';
        screenDiv.style.left = '50%';
        screenDiv.style.transform = 'translate(-50%, -50%)';
        screenDiv.style.backgroundImage = 'url("assets/Intro/charSelectionBg.jpg")';
        screenDiv.style.backgroundSize = '65%';
        screenDiv.style.backgroundRepeat = 'no-repeat';
        screenDiv.style.backgroundPosition = 'center';
        screenDiv.style.width = '100%';
        screenDiv.style.height = '100%';
        screenDiv.style.border = 'none';
        screenDiv.style.boxShadow = 'none';
        screenDiv.style.opacity = '0';
        document.body.appendChild(screenDiv);
        
// Create a container for the weapon selection
const weaponContainer = document.createElement('div');
weaponContainer.style.display = 'flex';
weaponContainer.style.flexDirection = 'column';
weaponContainer.style.alignItems = 'center';
weaponContainer.style.position = 'absolute';
weaponContainer.style.top = '34%';
weaponContainer.style.left = '44%';
weaponContainer.style.transform = 'translate(-50%, -50%)';
weaponContainer.style.width = '600px';
weaponContainer.style.height = '250px'; // Increased height to accommodate text
weaponContainer.style.fontFamily = '"Press Start 2P", sans-serif';
weaponContainer.style.fontSize = '14px';
weaponContainer.style.zIndex = '6';
weaponContainer.style.backgroundColor = 'none'; // Semi-transparent background

// Add weapon images to the container
const meleeWeapons = [
    { url: 'assets/Intro/weapon1.png', name: 'knife' },
    { url: 'assets/Intro/weapon2.png', name: 'sword' },
    { url: 'assets/Intro/weapon3.png', name: 'spear' }
];

const rangedWeapons = [
    { url: 'assets/Intro/weapon4.png', name: 'pistol' },
    { url: 'assets/Intro/weapon5.png', name: 'sniper' }
];

// Array to track selected weapons
let selectedMeleeWeapon: any = null;
let selectedRangedWeapon: any = null;

// Function to create weapon rows
const createWeaponRow = (weapons: any, label: any) => {
    const rowContainer = document.createElement('div');
    rowContainer.style.display = 'flex';
    rowContainer.style.alignItems = 'center';
    rowContainer.style.justifyContent = 'flex-start'; // Align items to the start (left side)
    rowContainer.style.marginBottom = '10px';
    rowContainer.style.width = '100%'; // Ensure the row takes up full width
    rowContainer.style.paddingLeft = '20px'; // Add padding to the left for spacing

    const labelDiv = document.createElement('div');
    labelDiv.textContent = label;
    labelDiv.style.color = 'white';
    labelDiv.style.fontSize = '24px';
    labelDiv.style.marginRight = '10px';
    labelDiv.style.width = '150px';
    rowContainer.appendChild(labelDiv);

    const weaponRow = document.createElement('div');
    weaponRow.style.display = 'flex';
    weaponRow.style.justifyContent = 'flex-start'; // Align items to the start (left side)

    weapons.forEach((weapon: any, index: any) => {
        const wrapper = document.createElement('div');
        const wrapperContainer = document.createElement('div'); // Container for the wrapper and text
        wrapperContainer.style.display = 'flex';
        wrapperContainer.style.flexDirection = 'column';
        wrapperContainer.style.alignItems = 'center';
        wrapperContainer.style.margin = '0 10px'; // Add some spacing between images
        wrapperContainer.classList.add('weapon-image'); // Add the weapon-image class for shaking effect
        wrapper.style.display = 'flex';
        wrapper.style.justifyContent = 'center';
        wrapper.style.alignItems = 'center';
        wrapper.style.backgroundColor = '#e03c28';
        wrapper.style.padding = '10px'; // Add padding around the image
        wrapper.style.border = 'none';
        wrapper.style.boxShadow = '4px 4px 0 black, 8px 8px 0 black';
        wrapper.style.cursor = 'pointer'; // Add pointer cursor

        const img = document.createElement('img');
        img.src = weapon.url;
        img.style.width = '60px'; // Adjust the size of the weapon images

        // Create a div for the weapon name
        const weaponName = document.createElement('div');
        weaponName.textContent = weapon.name;
        weaponName.style.color = 'white'; // Adjust text color
        weaponName.style.marginTop = '10px'; // Space between image and text

        // Add click event listener to change background color on click
        wrapper.addEventListener('click', () => {
            if (label === 'Melee') {
                if (selectedMeleeWeapon === wrapper) {
                    // If already selected, deselect
                    wrapper.style.backgroundColor = '#e03c28';
                    selectedMeleeWeapon = null;
                } else {
                    if (selectedMeleeWeapon) {
                        selectedMeleeWeapon.style.backgroundColor = '#e03c28';
                    }
                    // Select the clicked weapon
                    wrapper.style.backgroundColor = '#43ac42'; // Change the color as needed
                    selectedMeleeWeapon = wrapper;
                }
            } else if (label === 'Ranged') {
                if (selectedRangedWeapon === wrapper) {
                    // If already selected, deselect
                    wrapper.style.backgroundColor = '#e03c28';
                    selectedRangedWeapon = null;
                } else {
                    if (selectedRangedWeapon) {
                        selectedRangedWeapon.style.backgroundColor = '#e03c28';
                    }
                    // Select the clicked weapon
                    wrapper.style.backgroundColor = '#43ac42'; // Change the color as needed
                    selectedRangedWeapon = wrapper;
                }
            }
        });

        wrapper.appendChild(img);
        wrapper.classList.add('weapon-wrapper'); // Add a class for easier selection

        // Append the wrapper and weapon name to the wrapperContainer
        wrapperContainer.appendChild(wrapper);
        wrapperContainer.appendChild(weaponName);

        // Append the wrapperContainer to the weaponRow
        weaponRow.appendChild(wrapperContainer);
    });

    rowContainer.appendChild(weaponRow);
    return rowContainer;
};

// Create and append melee and ranged weapon rows
const meleeRow = createWeaponRow(meleeWeapons, 'Melee');
const rangedRow = createWeaponRow(rangedWeapons, 'Ranged');

weaponContainer.appendChild(meleeRow);
weaponContainer.appendChild(rangedRow);

// Add the weapon container to the screenDiv
screenDiv.appendChild(weaponContainer);

        // Add fade-in animation
        screenDiv.style.animation = 'fade-in 2s forwards';
    
        // Create a container for the images
        const imageContainer = document.createElement('div');
        imageContainer.style.display = 'flex';
        imageContainer.style.justifyContent = 'center';
        imageContainer.style.alignItems = 'center';
        imageContainer.style.position = 'absolute';
        imageContainer.style.top = '37%';
        imageContainer.style.left = '50%';
        imageContainer.style.transform = 'translate(-50%, -50%)';
        imageContainer.style.width = '90px';
        imageContainer.style.height = 'auto';
    
        // Add images to the container
        const imageUrls = [
            'assets/Intro/char2.png',
            'assets/Intro/char2.png',
            'assets/Intro/char2.png',
            'assets/Intro/char1.5.png',
            'assets/Intro/char2.png',
            'assets/Intro/char2.png',
            'assets/Intro/char2.png'
        ];
    
        imageUrls.forEach(url => {
            const img = document.createElement('img');
            img.src = url;
            img.classList.add('char-image'); // Add char-image class
            img.style.cursor = 'pointer'; // Add pointer cursor
            img.style.zIndex = '10'; // Ensure character images are above details div
            img.addEventListener('click', () => this.showCharacterDetails(img, url)); // Add click event listener
            imageContainer.appendChild(img);
        });
    
        screenDiv.appendChild(imageContainer);
    
        // Create and style the text element
        const textElement = document.createElement('div');
        textElement.textContent = 'SELECT YOUR WEAPONS & CHARACTER';
        textElement.style.position = 'absolute';
        textElement.style.top = '10%'; // Adjust the position as needed
        textElement.style.left = '50%';
        textElement.style.transform = 'translate(-50%, -50%)';
        textElement.style.fontFamily = '"Press Start 2P", sans-serif';
        textElement.style.color = 'white'; // Adjust the text color as needed
        textElement.style.fontSize = '24px'; // Adjust the font size as needed
        textElement.style.textAlign = 'center';
    
        screenDiv.appendChild(textElement);

    }
    
    showCharacterDetails(img:any, imageUrl:any) {
        // Remove highlight class from all character images
        const allChars = document.querySelectorAll('.char-image');
        allChars.forEach(char => char.classList.remove('highlight'));
    
        // Add highlight class to the clicked character image
        img.classList.add('highlight');
    
        // Remove any existing details div
        const existingDetailsDiv = document.getElementById('characterDetails');
        if (existingDetailsDiv) {
            existingDetailsDiv.remove();
        }
    
        // Create a new div for character details
        const detailsDiv = document.createElement('div');
        detailsDiv.id = 'characterDetails';
        detailsDiv.style.position = 'absolute';
        detailsDiv.style.top = '85%'; // Adjust position as needed
        detailsDiv.style.left = '50%';
        detailsDiv.style.transform = 'translate(-50%, -50%)';
        detailsDiv.style.display = 'flex';
        detailsDiv.style.justifyContent = 'space-between';
        detailsDiv.style.alignItems = 'center';
        detailsDiv.style.width = '80%'; // Adjust width as needed
        detailsDiv.style.height = 'auto';
        detailsDiv.style.paddingLeft = '100px';
        detailsDiv.style.paddingRight = '100px';
        detailsDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // Semi-transparent background
        detailsDiv.style.zIndex = '5'; // Ensure details div is below character images
    
        // Create and style the text elements for character details
        const textElement = document.createElement('div');
        textElement.style.display = 'flex';
        textElement.style.flexDirection = 'column';
    
        // First line
        const firstLine = document.createElement('div');
        firstLine.style.color = 'red';
        firstLine.style.fontFamily = '"Press Start 2P", sans-serif';
        firstLine.style.fontSize = '24px'; // Larger font size
        firstLine.textContent = imageUrl === 'assets/Intro/char2.png' ? 'Character Locked' : 'Askar';
    
        // Second line
        const secondLine = document.createElement('div');
        secondLine.style.color = 'white';
        secondLine.style.fontFamily = '"Press Start 2P", sans-serif';
        secondLine.style.fontSize = '16px'; // Normal font size
        secondLine.style.marginTop = '10px'; 
        secondLine.textContent = imageUrl === 'assets/Intro/char2.png' ? 'You haven\'t unlocked this character yet.' : 'A tough military leader, good at planning and very responsible.';
    
        // Append lines to text element
        textElement.appendChild(firstLine);
        textElement.appendChild(secondLine);
    
        // Determine the details image based on the clicked character
        let detailsImageUrl = '';
        if (imageUrl === 'assets/Intro/char2.png') {
            detailsImageUrl = 'assets/Intro/char2Displayed.png'; // Replace with your actual details image path
        } else if (imageUrl === 'assets/Intro/char1.5.png') {
            detailsImageUrl = 'assets/Intro/char1.5Display.png'; // Replace with your actual details image path
        }
    
        // Create and style the image element for character details
        const imgElement = document.createElement('img');
        imgElement.src = detailsImageUrl; // Use the corresponding details image
        imgElement.style.width = '200px'; // Adjust width as needed
        imgElement.style.height = 'auto'; // Maintain aspect ratio
    
        // Append text and image elements to the details div
        detailsDiv.appendChild(textElement);
        detailsDiv.appendChild(imgElement);
    
        // Append the details div to the screen div if it exists
        const screenDiv = document.getElementById('showScreenCharacter');
        if (screenDiv) {
            screenDiv.appendChild(detailsDiv);
        } else {
            console.error('showScreenCharacter element not found');
        }
    }
    

    showScreen4() {
        this.cleanup();
    
        const screenDiv = document.createElement('div');
        screenDiv.id = 'screen4';
        screenDiv.style.position = 'fixed';
        screenDiv.style.top = '50%';
        screenDiv.style.left = '50%';
        screenDiv.style.transform = 'translate(-50%, -50%)';
        screenDiv.style.backgroundImage = 'url("assets/Intro/ChapterOne.png")';
        screenDiv.style.backgroundSize = '40% 70%'; 
        screenDiv.style.backgroundRepeat = 'no-repeat'; 
        screenDiv.style.backgroundPosition = 'center';
        screenDiv.style.width = '100%'; 
        screenDiv.style.height = '100%'; 
        screenDiv.style.border = 'none';
        screenDiv.style.boxShadow = 'none';
        screenDiv.style.opacity = '0'; 
        document.body.appendChild(screenDiv);
    
        screenDiv.style.animation = 'fade-in 2s forwards';
    
        setTimeout(() => {
            screenDiv.style.animation = 'fade-out 1s forwards';
    
            setTimeout(() => {
                this.cleanup();
                this.showScreen5();
            }, 1000); 
        }, 3000); 
    }

    showScreen5() {
        this.cleanup();
    
        const screenDiv = document.createElement('div');
        screenDiv.id = 'screen5';
        screenDiv.style.position = 'fixed';
        screenDiv.style.top = '50%';
        screenDiv.style.left = '50%';
        screenDiv.style.transform = 'translate(-50%, -50%)';
        screenDiv.style.backgroundImage = 'url("assets/Intro/introBridge.png")';
        screenDiv.style.backgroundSize = '70% 100%';
        screenDiv.style.backgroundRepeat = 'no-repeat';
        screenDiv.style.backgroundPosition = 'center';
        screenDiv.style.width = '100%';
        screenDiv.style.height = '100%';
        screenDiv.style.border = 'none';
        screenDiv.style.boxShadow = 'none';
        screenDiv.style.opacity = '0';
        document.body.appendChild(screenDiv);
    
        const dialogueDiv = document.createElement('div');
        dialogueDiv.id = 'dialogue';
        dialogueDiv.style.position = 'absolute';
        dialogueDiv.style.left = '260px';
        dialogueDiv.style.top = '50px';
        dialogueDiv.style.fontFamily = '"Press Start 2P", sans-serif';
        dialogueDiv.style.fontSize = '15px';
        dialogueDiv.style.color = 'black';
        dialogueDiv.style.width = '45%';
        dialogueDiv.style.background = 'white';
        dialogueDiv.style.padding = '10px';
        dialogueDiv.style.border = '4px solid black';
        dialogueDiv.style.boxShadow = '6px 6px 0 black, 12px 12px 0 black';
        dialogueDiv.style.imageRendering = 'pixelated';
        document.body.appendChild(dialogueDiv);
    
        new Typed('#dialogue', {
            strings: ['Two years have passed since the attacks began, The situation in Brunei Muara has worsened day by day. I\'m hopeful that Temburong is as safe as the rumors suggest. Great, the bridge is closed off! It appears my journey is about to take an unexpected turn…'],
            typeSpeed: 20,
            showCursor: false,
            onComplete: () => {
                const continueButton = document.createElement('button');
                continueButton.textContent = '>>';
                continueButton.style.position = 'absolute';
                continueButton.style.bottom = '1%';
                continueButton.style.right = '1%';
                continueButton.style.padding = '8px 15px';
                continueButton.style.background = 'black';
                continueButton.style.color = 'white';
                continueButton.style.fontFamily = '"Press Start 2P", Arial, sans-serif';
                continueButton.style.fontSize = '10px';
                continueButton.style.border = 'none';
                continueButton.style.cursor = 'pointer';
                continueButton.classList.add('continue-button');
                continueButton.addEventListener('click', () => this.startMainGame());
                dialogueDiv.appendChild(continueButton);
                continueButton.style.zIndex = '100';
            }
        });
    
        screenDiv.style.animation = 'fade-in 1s forwards';
    }
    
    

    startMainGame() {
        this.cleanup();
        this.scene.start('Game');
    }

    cleanup() {
        const elementsToRemove = ['screen1', 'screen2', 'screen3', 'screen4', 'screen5', 'dialogue'];
        elementsToRemove.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                document.body.removeChild(element);
            }
        });
    }
    
}
