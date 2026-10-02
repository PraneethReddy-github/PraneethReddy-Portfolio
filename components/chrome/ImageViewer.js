import React, { Component } from 'react';
import { GALLERY } from '../ios/galleryPhotos';

export default class ImageViewer extends Component {
    constructor(props) {
        super(props);
        const urlParams = new URLSearchParams(props.url.split('?')[1]);
        const imgPath = urlParams.get('img') || '';
        
        let initialIndex = GALLERY.findIndex(p => p.includes(imgPath));
        if (initialIndex === -1) initialIndex = 0;

        this.state = {
            currentIndex: initialIndex
        };
    }

    componentDidMount() {
        // Need to add tabIndex to a div and focus it to capture keydown events 
        // without document-wide listener, but we can just use document-wide for simplicity
        // in a controlled environment, or add a ref. We'll use document for now.
        document.addEventListener('keydown', this.handleKeyDown);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    handleKeyDown = (e) => {
        // Only handle keys if this viewer is visible/active.
        // We assume it's active if it's rendered, but since tabs might be hidden, 
        // we could check visibility, or just let it be. Let's check offsetParent to see if visible.
        if (this.containerRef && !this.containerRef.offsetParent) return;
        
        if (e.key === 'ArrowLeft') {
            this.prevImage();
        } else if (e.key === 'ArrowRight') {
            this.nextImage();
        }
    }

    prevImage = () => {
        this.setState(prevState => ({
            currentIndex: prevState.currentIndex === 0 ? GALLERY.length - 1 : prevState.currentIndex - 1
        }));
    }

    nextImage = () => {
        this.setState(prevState => ({
            currentIndex: prevState.currentIndex === GALLERY.length - 1 ? 0 : prevState.currentIndex + 1
        }));
    }

    render() {
        const { currentIndex } = this.state;
        const imageSrc = GALLERY[currentIndex];

        return (
            <div 
                ref={el => this.containerRef = el}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#1a1a1a',
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', boxSizing: 'border-box', padding: '24px', overflow: 'auto' }}>
                    <img 
                        src={imageSrc} 
                        alt="Gallery View" 
                        style={{ 
                            maxWidth: '100%', 
                            maxHeight: '100%', 
                            objectFit: 'contain' 
                        }} 
                    />
                </div>
                
                {/* Bottom Controls */}
                <div style={{
                    position: 'absolute',
                    bottom: '24px',
                    display: 'flex',
                    gap: '30px',
                    backgroundColor: 'rgba(30, 30, 30, 0.7)',
                    padding: '12px 24px',
                    borderRadius: '30px',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                }}>
                    <button 
                        onClick={this.prevImage}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '8px',
                            transition: 'transform 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <svg viewBox="0 0 24 24" style={{ width: '32px', height: '32px', fill: 'white' }}>
                            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                        </svg>
                    </button>
                    <button 
                        onClick={this.nextImage}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '8px',
                            transition: 'transform 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <svg viewBox="0 0 24 24" style={{ width: '32px', height: '32px', fill: 'white' }}>
                            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                        </svg>
                    </button>
                </div>
            </div>
        );
    }
}
