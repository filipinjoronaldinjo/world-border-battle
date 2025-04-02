
import React, { useEffect, useRef, useState } from 'react';
import { useGame } from '@/context/GameContext';
import { toast } from '@/components/ui/use-toast';

const WorldMap: React.FC = () => {
  const { gameState, makePlayerMove, setHighlightedCountry } = useGame();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [activeCountry, setActiveCountry] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    
    // Create the SVG element directly
    const mapSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    mapSvg.setAttribute("viewBox", "0 0 1000 500");
    mapSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    
    // Add the base map image from the uploaded file
    mapSvg.innerHTML = `
      <image href="/lovable-uploads/ab913d07-ae8a-4ee4-83fa-9f1d87c1e5a9.png" width="1000" height="500" preserveAspectRatio="xMidYMid meet" class="base-map"/>
      
      <g id="countries">
        <!-- North America -->
        <path data-name="Kanada" d="M200 100 L250 100 L300 120 L320 110 L340 120 L280 140 L270 160 L240 170 L210 150 L180 130 L200 100" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Sjedinjene Američke Države" d="M180 130 L210 150 L240 170 L250 190 L230 210 L210 215 L180 210 L150 200 L140 180 L150 160 L180 130" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Meksiko" d="M150 200 L180 210 L210 215 L200 240 L180 250 L160 240 L140 220 L150 200" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        
        <!-- Central America -->
        <path data-name="Gvatemala" d="M180 250 L190 245 L195 250 L185 255" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Belize" d="M185 245 L187 243 L189 245 L187 247" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Salvador" d="M185 255 L190 253 L195 255 L190 257" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Honduras" d="M190 245 L195 243 L200 245 L195 250" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Nikaragva" d="M190 255 L195 250 L200 252 L195 257" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Kostarika" d="M195 257 L200 255 L205 257 L200 260" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Panama" d="M200 260 L205 257 L210 260 L205 263" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        
        <!-- South America -->
        <path data-name="Kolumbija" d="M205 263 L210 260 L220 270 L215 290 L205 295 L200 285 L203 275" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Venecuela" d="M220 270 L240 265 L245 270 L225 280 L215 290" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Gvajana" d="M245 270 L250 265 L255 270 L250 275" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Surinam" d="M250 270 L255 265 L260 270 L255 275" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Francuska Gvajana" d="M255 270 L260 265 L265 270 L260 275" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Brazil" d="M225 280 L250 275 L270 280 L290 290 L295 310 L280 330 L265 335 L250 330 L240 310 L225 300" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Ekvador" d="M205 295 L215 290 L220 295 L210 300" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Peru" d="M210 300 L220 295 L240 310 L230 320 L215 315" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Bolivija" d="M230 320 L240 310 L250 330 L240 340 L230 330" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Paragvaj" d="M250 330 L265 335 L260 345 L245 340" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Urugvaj" d="M260 345 L270 340 L275 345 L265 350" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Argentina" d="M240 340 L245 340 L260 345 L265 350 L260 370 L250 380 L240 370 L235 350" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Čile" d="M235 350 L240 340 L230 330 L225 340 L230 360 L240 370 L235 350" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        
        <!-- Europe -->
        <path data-name="Srbija" d="M525 235 L532 230 L538 232 L543 240 L535 243 L528 240" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Hrvatska" d="M510 230 L525 235 L527 240 L515 245 L505 238" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Bosna i Hercegovina" d="M515 245 L527 240 L535 243 L530 250 L522 252" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Crna Gora" d="M530 250 L535 243 L543 240 L545 245 L538 250" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Bugarska" d="M545 235 L550 233 L560 236 L560 248 L550 245" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Severna Makedonija" d="M538 250 L545 245 L550 245 L550 253 L540 253" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Kosovo" d="M535 243 L538 238 L543 240 L540 244" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Albanija" d="M530 253 L538 250 L540 253 L535 257" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Grčka" d="M540 253 L550 253 L558 265 L540 270 L535 257" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Rumunija" d="M538 232 L550 233 L560 228 L555 223 L545 227" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Mađarska" d="M520 225 L532 230 L538 232 L532 220 L525 220" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Austrija" d="M505 220 L520 225 L525 220 L515 210 L505 215" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Slovenija" d="M505 220 L510 230 L505 238 L500 230 L502 225" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Italija" d="M485 240 L505 238 L485 210 L475 205 L460 220 L465 235" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Švajcarska" d="M490 210 L495 205 L500 207 L500 215 L492 215" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Francuska" d="M460 220 L475 205 L490 210 L492 215 L485 240 L450 225" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Španija" d="M450 225 L465 235 L460 250 L425 245 L430 230" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Portugal" d="M425 245 L430 230 L420 235 L415 240" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Nemačka" d="M500 207 L505 215 L515 210 L525 220 L515 195 L505 190" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Belgija" d="M485 200 L490 195 L495 197 L490 205" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Holandija" d="M490 190 L495 185 L500 186 L497 193 L492 192" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Češka" d="M515 195 L515 210 L505 215 L500 207 L505 200" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Slovačka" d="M525 220 L532 220 L530 210 L520 207 L515 210" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Poljska" d="M515 195 L520 207 L530 210 L535 200 L525 185" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Danska" d="M495 175 L500 170 L505 171 L500 180" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Švedska" d="M505 155 L510 145 L515 150 L515 170 L505 171" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Norveška" d="M490 150 L500 135 L510 145 L505 155 L495 160" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Finska" d="M525 130 L535 135 L540 145 L530 155 L520 150" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Rusija" d="M540 145 L570 115 L690 115 L715 160 L715 210 L650 225 L600 210 L580 215 L560 228 L555 223 L545 227 L538 232 L535 200 L530 185 L520 150" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Estonija" d="M535 155 L540 150 L545 152 L540 157" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Letonija" d="M535 160 L540 157 L545 159 L540 163" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Litvanija" d="M532 165 L540 163 L543 167 L535 170" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Belorusija" d="M535 170 L543 167 L555 175 L550 185 L535 185" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Ukrajina" d="M550 185 L555 175 L580 185 L580 215 L560 228 L550 233 L545 227 L538 232 L532 220 L530 210 L535 200" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Moldavija" d="M555 223 L560 228 L558 233 L553 230" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Velika Britanija" d="M470 180 L480 165 L490 170 L485 185 L475 190" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Irska" d="M465 175 L470 170 L475 175 L470 180" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Island" d="M450 135 L460 130 L470 135 L460 140" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        
        <!-- Asia -->
        <path data-name="Turska" d="M560 236 L580 215 L600 220 L610 230 L590 245 L575 240" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Gruzija" d="M600 220 L610 215 L615 217 L610 222" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Jermenija" d="M610 222 L615 217 L618 219 L615 223" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Azerbejdžan" d="M615 217 L625 212 L630 215 L618 219" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Iran" d="M618 219 L630 215 L650 240 L625 250 L610 230" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Irak" d="M610 230 L625 250 L605 255 L590 245" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Sirija" d="M590 245 L610 230 L605 255 L585 250" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Izrael" d="M587 250 L590 248 L592 251 L589 253" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Jordan" d="M592 251 L605 255 L600 260 L589 253" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Saudijska Arabija" d="M600 260 L625 250 L640 270 L615 290 L590 270" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Kuvajt" d="M625 250 L628 248 L630 250 L627 252" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Ujedinjeni Arapski Emirati" d="M640 270 L645 268 L648 270 L643 272" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Oman" d="M645 270 L650 265 L655 270 L650 275" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Jemen" d="M625 280 L640 270 L650 275 L635 285" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Kazahstan" d="M600 210 L650 225 L660 200 L625 180" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Uzbekistan" d="M650 225 L670 220 L675 205 L660 200" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Turkmenistan" d="M650 225 L660 200 L675 205 L665 230 L650 240 L630 215" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Kirgistan" d="M660 200 L675 205 L690 195 L670 190" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Tadžikistan" d="M675 205 L690 195 L695 200 L680 210" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Avganistan" d="M665 230 L680 210 L695 215 L690 235 L675 240" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Pakistan" d="M675 240 L690 235 L710 255 L685 260 L665 245" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Indija" d="M710 255 L740 230 L745 260 L730 280 L685 270 L685 260" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Nepal" d="M710 240 L720 235 L725 238 L715 243" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Butan" d="M730 242 L735 238 L740 241 L735 245" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Bangladeš" d="M735 250 L740 245 L745 248 L740 253" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Mjanmar" d="M745 248 L755 240 L760 250 L750 260" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Kina" d="M715 210 L715 160 L750 150 L790 170 L795 220 L780 235 L765 235 L755 240 L745 248 L740 241 L735 238 L725 238 L715 243 L710 240 L710 225 L695 215 L690 195 L670 190" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Mongolija" d="M715 160 L750 150 L770 145 L780 155 L760 170" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Severna Koreja" d="M795 220 L800 215 L805 218 L800 223" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Južna Koreja" d="M800 223 L805 218 L808 222 L803 227" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Japan" d="M815 210 L825 200 L830 205 L820 215" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Tajland" d="M755 275 L760 270 L767 273 L762 278" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Laos" d="M760 270 L765 265 L772 268 L767 273" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Vijetnam" d="M765 265 L770 260 L777 263 L772 268" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Kambodža" d="M760 275 L767 273 L772 275 L765 278" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Malezija" d="M760 283 L765 280 L770 282 L765 285" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Indonezija" d="M770 290 L785 285 L795 290 L780 295" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Filipini" d="M800 250 L805 245 L810 250 L805 255" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        
        <!-- Africa -->
        <path data-name="Egipat" d="M558 265 L575 240 L590 245 L589 270 L565 280" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Libija" d="M525 280 L565 280 L570 305 L530 305" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Tunis" d="M490 265 L500 260 L505 265 L495 270" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Alžir" d="M470 285 L495 270 L525 280 L530 305 L480 315" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Maroko" d="M450 280 L470 285 L480 295 L460 295" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Mauritanija" d="M430 300 L440 300 L460 295 L455 310" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Mali" d="M460 295 L480 295 L485 315 L465 320" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Niger" d="M480 315 L530 305 L535 320 L495 330" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Nigerija" d="M485 325 L495 330 L500 345 L490 340" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Čad" d="M530 305 L570 305 L565 325 L535 320" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Sudan" d="M570 305 L590 290 L605 300 L585 330 L565 325" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Južni Sudan" d="M565 325 L585 330 L583 340 L563 335" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Etiopija" d="M585 330 L605 300 L615 305 L600 335" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Somalija" d="M615 305 L625 300 L630 310 L620 315" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Kenija" d="M585 340 L600 335 L605 345 L590 350" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Uganda" d="M570 335 L583 340 L585 350 L572 345" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Tanzanija" d="M585 350 L600 345 L605 360 L590 365" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Demokratska Republika Kongo" d="M550 360 L590 365 L585 380 L545 375" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Angola" d="M550 380 L570 375 L575 390 L555 395" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Zambija" d="M570 375 L585 380 L590 395 L575 390" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Zimbabve" d="M575 390 L590 395 L595 400 L580 395" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Mozambik" d="M590 395 L605 390 L610 405 L595 410" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Namibija" d="M550 400 L565 400 L570 410 L555 410" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Bocvana" d="M565 400 L580 395 L585 405 L570 410" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Južnoafrička Republika" d="M560 410 L585 405 L595 415 L570 420" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        
        <!-- Australia -->
        <path data-name="Australija" d="M775 355 L810 340 L830 365 L810 390 L775 380" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
        <path data-name="Novi Zeland" d="M840 395 L850 390 L855 395 L845 400" fill="rgba(200,200,200,0.2)" stroke="#333" stroke-width="1"/>
      </g>
    `;
    
    mapContainerRef.current.appendChild(mapSvg);
    
    // Add event listeners to country paths
    const countryPaths = mapSvg.querySelectorAll('path[data-name]');
    countryPaths.forEach(path => {
      const countryName = path.getAttribute('data-name');
      if (!countryName) return;
      
      path.addEventListener('mouseenter', () => {
        setHighlightedCountry(countryName);
        path.classList.add('hover');
      });
      
      path.addEventListener('mouseleave', () => {
        setHighlightedCountry(null);
        path.classList.remove('hover');
      });
      
      path.addEventListener('click', () => {
        if (gameState.isPlayerTurn) {
          makePlayerMove(countryName);
          zoomToCountry(path as SVGPathElement);
        } else {
          toast({
            title: "Nije vaš potez",
            description: "Sačekajte da računar završi svoj potez",
            variant: "destructive"
          });
        }
      });
    });
    
    setMapLoaded(true);
    updateCountryColors();
    
    return () => {
      // Clean up event listeners
      const countryPaths = mapContainerRef.current?.querySelectorAll('path');
      if (countryPaths) {
        countryPaths.forEach(path => {
          path.removeEventListener('mouseenter', () => {});
          path.removeEventListener('mouseleave', () => {});
          path.removeEventListener('click', () => {});
        });
      }
    };
  }, [setHighlightedCountry, makePlayerMove, gameState.isPlayerTurn]);

  // Function to update country colors based on game state
  const updateCountryColors = () => {
    if (!mapContainerRef.current || !mapLoaded) return;
    
    // Reset all countries to default values
    const countryPaths = mapContainerRef.current.querySelectorAll('path[data-name]');
    countryPaths.forEach(path => {
      path.classList.remove('player-country', 'computer-country', 'highlighted');
      path.setAttribute('fill', 'rgba(200,200,200,0.2)');
      path.setAttribute('stroke', '#333');
      path.setAttribute('stroke-width', '1');
    });
    
    // Mark player countries
    gameState.playerHistory.forEach(country => {
      const path = mapContainerRef.current?.querySelector(`path[data-name="${country}"]`);
      if (path) {
        path.classList.add('player-country');
        path.setAttribute('fill', 'rgba(59, 130, 246, 0.7)'); // blue with opacity
        path.setAttribute('stroke', '#ffffff');
        path.setAttribute('stroke-width', '1');
      }
    });
    
    // Mark computer countries
    gameState.computerHistory.forEach(country => {
      const path = mapContainerRef.current?.querySelector(`path[data-name="${country}"]`);
      if (path) {
        path.classList.add('computer-country');
        path.setAttribute('fill', 'rgba(239, 68, 68, 0.7)'); // red with opacity
        path.setAttribute('stroke', '#ffffff');
        path.setAttribute('stroke-width', '1');
      }
    });
    
    // Mark highlighted country
    if (gameState.highlightedCountry) {
      const path = mapContainerRef.current.querySelector(`path[data-name="${gameState.highlightedCountry}"]`);
      if (path) {
        path.classList.add('highlighted');
        path.setAttribute('stroke', '#10b981'); // green
        path.setAttribute('stroke-width', '2');
      }
    }
    
    // Zoom to the most recently selected country
    const lastCountry = gameState.currentCountry;
    if (lastCountry && lastCountry !== activeCountry) {
      const countryPath = mapContainerRef.current.querySelector(`path[data-name="${lastCountry}"]`) as SVGPathElement;
      if (countryPath) {
        zoomToCountry(countryPath);
        setActiveCountry(lastCountry);
      }
    }
  };

  // Add an explicit effect for updating country colors whenever game state changes
  useEffect(() => {
    updateCountryColors();
  }, [gameState.playerHistory, gameState.computerHistory, gameState.highlightedCountry, gameState.currentCountry, activeCountry, mapLoaded]);

  const zoomToCountry = (countryPath: SVGPathElement) => {
    if (!countryPath || !mapContainerRef.current) return;
    
    try {
      // Get the bounding box of the country path
      const bbox = countryPath.getBBox();
      
      // Calculate center of the bounding box
      const centerX = bbox.x + bbox.width / 2;
      const centerY = bbox.y + bbox.height / 2;
      
      // Calculate appropriate zoom level based on country size
      // Smaller countries get higher zoom
      const svgElement = mapContainerRef.current.querySelector('svg');
      if (!svgElement) return;
      
      const svgWidth = 1000; // from viewBox
      const svgHeight = 500; // from viewBox
      
      const containerWidth = mapContainerRef.current.clientWidth;
      const containerHeight = mapContainerRef.current.clientHeight;
      
      // Determine zoom factor based on country size
      // Ensure country takes up at least 20% of the view
      const minDimension = Math.min(containerWidth, containerHeight);
      const maxCountryDimension = Math.max(bbox.width, bbox.height);
      const targetSize = minDimension * 0.3; // Target 30% of viewport
      
      let newZoom = targetSize / (maxCountryDimension / (svgWidth / 1000));
      newZoom = Math.min(Math.max(newZoom, 1), 4); // Limit zoom between 1x and 4x
      
      // Calculate pan position to center the country
      const newX = -(centerX * newZoom - containerWidth / 2);
      const newY = -(centerY * newZoom - containerHeight / 2);
      
      // Apply zoom and pan with animation
      setZoom(newZoom);
      setPanPosition({ x: newX, y: newY });
      
    } catch (error) {
      console.error("Error zooming to country:", error);
    }
  };

  const resetZoom = () => {
    setZoom(1);
    setPanPosition({ x: 0, y: 0 });
    setActiveCountry(null);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="map-container w-full h-[65vh] max-h-[800px] border rounded-lg shadow-lg overflow-hidden bg-black relative">
        <div 
          ref={mapContainerRef} 
          className="w-full h-full"
          style={{
            transform: `scale(${zoom}) translate(${panPosition.x / zoom}px, ${panPosition.y / zoom}px)`,
            transformOrigin: '0 0',
            transition: 'transform 0.5s ease-out'
          }}
        >
          {/* SVG map will be inserted here */}
        </div>
        
        <div className="absolute bottom-4 right-4 flex gap-2">
          <button 
            className="bg-white/80 backdrop-blur-sm p-2 rounded-full shadow hover:bg-white"
            onClick={resetZoom}
            title="Reset zoom"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 3 18 18"/>
              <path d="M10.5 10.5 3 18"/>
              <path d="M21 21v-6"/>
              <path d="M21 21H15"/>
              <path d="M18 18 9 9"/>
            </svg>
          </button>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .map-container path {
          cursor: pointer;
          transition: fill 0.3s ease, stroke 0.3s ease, stroke-width 0.3s ease;
        }
        
        .map-container path:hover {
          stroke: #10b981 !important;
          stroke-width: 1.5px !important;
        }
        
        .player-country {
          fill: rgba(59, 130, 246, 0.7) !important; /* blue with opacity */
          stroke-width: 0.5px;
          stroke: #ffffff;
        }
        
        .computer-country {
          fill: rgba(239, 68, 68, 0.7) !important; /* red with opacity */
          stroke-width: 0.5px;
          stroke: #ffffff;
        }
        
        .highlighted {
          stroke: #10b981 !important;
          stroke-width: 2px !important;
        }
        
        .base-map {
          opacity: 0.8;
          pointer-events: none;
        }
      `}} />
    </div>
  );
};

export default WorldMap;
