import React, { useRef, useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { MAPBOX_TOKEN } from '../../environment/environment';
import { getOrchards } from '../../services/orchardService';
import { OrchardLocation } from '../../models/orchardData';

interface AreaMapboxProps {
}

type Props = AreaMapboxProps;

const AreaMapbox: React.FC<Props> = (props: Props) => {

	const mapContainer = useRef(null);
	const map = useRef(null);
	const [lng, setLng] = useState(0.54467264489599998);
	const [lat, setLat] = useState(51.195933126500002);
	const [zoom, setZoom] = useState(15);
	const [orchardData, setOrchardData] = useState<OrchardLocation[]>([])
	const [orchardDataFiltered, setOrchardDataFiltered] = useState<OrchardLocation[]>([])
	const [orchardDataChecked, setOrchardDataChecked] = useState<OrchardLocation[]>([])
	const [filterText, setFilterText] = useState<string>("")

	useEffect(() => {
		if (map.current) return; // initialize map only once
		mapboxgl.accessToken = MAPBOX_TOKEN;
		(map.current as any) = new mapboxgl.Map({
			container: (mapContainer.current as any),
			style: 'mapbox://styles/mapbox/satellite-v9',
			center: [lng, lat],
			zoom: zoom,

		});
		const mapCurrent = (map.current as any);
		mapCurrent.on('load', function () {
			mapCurrent.resize();
		});
	});

	useEffect(() => {
		getOrchards().then((orchardData) => {
			console.log(orchardData);
			
			setOrchardData(orchardData);
			setOrchardDataChecked(orchardData);
			setOrchardDataFiltered(orchardData);

			const mapCurrent = (map.current as any);
			mapCurrent.on('load', function () {
				// Add the GeoJSON data.
				orchardData.forEach(location => {
					mapCurrent.addSource(location.name, {
						'type': 'geojson',
						'data': {
							'type': 'Feature',
							'properties': {},
							'geometry': location.boundaries 
						}
					});
					// Add a new layer to visualize the polygon.
					mapCurrent.addLayer({
						'id': location.name,
						'type': 'fill',
						'source': location.name, // reference the data source
						'layout': {},
						'paint': {
						'fill-color': '#fcd34d', // blue color fill
						'fill-opacity': 0.5
						}
					});
					// Add an outline around the polygon.
					mapCurrent.addLayer({
						'id': `${location.name}-outline`,
						'type': 'line',
						'source': location.name,
						'layout': {},
						'paint': {
						'line-color': '#d97706',
						'line-width': 2
						}
					});
	
					mapCurrent.addLayer({
						"id": `${location.name}-name`,
						"type": "symbol",
						"source": location.name,
						"layout": {
							"text-field": location.name,
							"text-font": [
								"DIN Offc Pro Medium",
								"Arial Unicode MS Bold"
							],
							// "text-color": "#d97706",
							"text-size": 12
						},
						paint: {
							"text-color": "#991b1b"
						}
					});
	
				})
			})
		});
	}, [])

	useEffect(() => {
		const mapCurrent = (map.current as any);

		orchardData.map(location => {
			const checked = orchardDataChecked.some(x => x.name === location.name) && orchardDataFiltered.some(x => x.name === location.name);
			var visibility = mapCurrent.getLayoutProperty(
				`${location.name}-outline`,
				'visibility'
			);
			
			// Toggle layer visibility by changing the layout object's visibility property.
			if (!checked) {
				mapCurrent.setLayoutProperty(
					`${location.name}-outline`,
					'visibility',
					'none'
				);
				mapCurrent.setLayoutProperty(
					`${location.name}`,
					'visibility',
					'none'
				);
				mapCurrent.setLayoutProperty(
					`${location.name}-name`,
					'visibility',
					'none'
				);
			} else {
				mapCurrent.setLayoutProperty(
					`${location.name}-outline`,
					'visibility',
					'visible'
				);
				mapCurrent.setLayoutProperty(
					`${location.name}`,
					'visibility',
					'visible'
				);
				mapCurrent.setLayoutProperty(
					`${location.name}-name`,
					'visibility',
					'visible'
				);
			}	

		})
	}, [orchardDataChecked, orchardDataFiltered]);


	function handleToggleField(location: OrchardLocation) {
		const index = orchardDataChecked.findIndex(x => x.name === location.name);
		
		if(index !== -1) {
			let newFiltered = [...orchardDataChecked];
			newFiltered.splice(index, 1);
			setOrchardDataChecked(newFiltered);
		}
		else { 
			let newFiltered = [location, ...orchardDataChecked];
			setOrchardDataChecked(newFiltered);
		}

		
	}

	useEffect(() => {
		const filteredOrchards = orchardData.filter(x => x.name.toLowerCase().includes(filterText.toLowerCase()) || filterText === "");
		setOrchardDataFiltered(filteredOrchards);

	}, [filterText])

	return (
		<div className="w-full h-full flex relative">
			<div className="absolute flex flex-col ml-2">

				<input placeholder="Filter fields" type="text" className="rounded my-2 p-1 px-2" value={filterText} onChange={e => setFilterText(e.target.value)}/>
				<ul className=" flex flex-col justify-start">
					{orchardDataFiltered.map(location => {
						const checked = orchardDataChecked.some(x => x.name === location.name);

						return (
							<li className="text-yellow-500 flex justify-start items-center">
								<input type="checkbox" className="checked:bg-blue-600 checked:border-transparent w-4 h-4" checked={checked} onChange={() => handleToggleField(location)}/>
								<label className="ml-2 ">{location.name}</label>
							</li>
						)
					})}

				</ul>
			</div>

			<div ref={mapContainer} className="map-container h-map-max w-full" />
		</div>
	);
}


export default AreaMapbox;