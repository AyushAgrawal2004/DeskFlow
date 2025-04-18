import Workspace3D from './workspace3D.js';

export function initScene(containerId = 'scene-container') {
    // Create scene container if it doesn't exist
    if (!document.getElementById(containerId)) {
        const container = document.createElement('div');
        container.id = containerId;
        container.className = 'scene-container';
        document.body.insertBefore(container, document.body.firstChild);
    }

    // Initialize scene
    const workspace = new Workspace3D(containerId);

    // Add scroll handler
    window.addEventListener('scroll', () => {
        const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        workspace.updateScroll(scrollPercent);
    });

    return workspace;
}

// Add scene to current page
document.addEventListener('DOMContentLoaded', () => {
    initScene();
}); 