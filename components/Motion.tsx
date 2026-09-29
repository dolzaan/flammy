'use client';
import {useEffect} from 'react';
export default function Motion(){useEffect(()=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const els=document.querySelectorAll('.section-heading,.studio-content,.steps article');const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.08});els.forEach(e=>{e.classList.add('reveal');observer.observe(e)});return()=>observer.disconnect()},[]);return null}
