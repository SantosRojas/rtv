import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import styled from "styled-components";
import { useSwipeable } from 'react-swipeable'; // Importa la biblioteca react-swipeable
import channels from "../data/channels"

const CardView = styled.div`
    display: flex;
    border: none;
    background-color: #423636;
    border-radius: .5rem;
    /* margin: 0.3rem; */
    overflow-y: hidden;
    box-sizing:border-box;
`

const Container = styled.div`
    display:flex;
    flex-direction: column;
    background-color: #292727;
    height: 100vh;
    position: relative; // Agregado para permitir el posicionamiento absoluto de los hijos
`


const VideoList = styled.ul`
  position: absolute;
  left: 7px;
  top: 7px;
  list-style-type: none;
  padding: 0;
  margin: 0;
  background-color: #29272790;
  color: white;
  border-radius: 0.3rem;
  max-height: 100vh; // Establece una altura máxima de 100vh
  overflow-y: auto; // Agrega una barra de desplazamiento vertical si es necesario
  
`;


const VideoListItem = styled.li`
    padding: 10px; // Espacio alrededor de cada elemento de la lista
    cursor: pointer; // Cambia el cursor a una mano cuando se pasa por encima
    &:hover {
        background-color: #2fd8ee; // Cambia el color de fondo cuando se pasa por encima
        color: black;
        font-weight: bold;
    }
    &:first-child {
        border-radius: 0.3rem 0.3rem 0 0; // Redondear la esquina superior izquierda del primer elemento
    }
    &:last-child {
        border-radius: 0 0 0.3rem 0.3rem;// Redondear la esquina inferior izquierda del último elemento
    }
`



const IPTVPlayer = () => {
    const [videoUrl, setVideoUrl] = useState(channels[0].url); // Estado para la URL del video IPTV
    const [isHovering, setIsHovering] = useState(false); // Estado para controlar la visibilidad de la lista
    const [mouseActivity, setMouseActivity] = useState(true); // Estado para controlar la actividad del mouse
    const timerRef = useRef(null); // Referencia para el temporizador
    

    const handleVideoSelect = (url) => {
        setVideoUrl(url);
        setIsHovering(false); // Oculta la lista después de seleccionar un video
    };

    const handleMouseActivity = () => {
        setMouseActivity(true);
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setMouseActivity(false), 2000); // Oculta la lista después de 2 segundos de inactividad
    };

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseActivity);
        window.addEventListener('touchstart', handleMouseActivity);
        return () => {
            window.removeEventListener('mousemove', handleMouseActivity);
            window.removeEventListener('touchstart', handleMouseActivity);
        };
    }, []);

    const handlers = useSwipeable({
        onSwipedLeft: () => setIsHovering(false), // Oculta la lista cuando se desliza hacia la izquierda
        onSwipedRight: () => setIsHovering(true), // Muestra la lista cuando se desliza hacia la derecha
    });

    return (
        <Container {...handlers} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
            <CardView>
                <ReactPlayer
                    url={videoUrl}
                    controls
                    width="100%"
                    height="100%"
                    playing={true}
                />

            </CardView>

            {isHovering && mouseActivity && (
                <VideoList>
                    {channels.map((channel, index) => (
                        <VideoListItem key={index} onClick={() => handleVideoSelect(channel.url)}>
                            {channel.name}
                        </VideoListItem>
                    ))}
                </VideoList>
            )}

        </Container>
    );
};

export default IPTVPlayer;
