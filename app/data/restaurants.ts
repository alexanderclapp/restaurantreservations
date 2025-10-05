export interface Restaurant {
  id: string
  name: string
  image: string
  cuisine: string
  neighborhood: string
  phone: string
}

export const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Casa Mono',
    cuisine: 'Spanish Tapas',
    neighborhood: 'Chamberí',
    phone: '+573104482052',
    image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    name: 'Lhardy',
    cuisine: 'Classic Spanish',
    neighborhood: 'Sol',
    phone: '+573104482052',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '3',
    name: 'Ten con Ten',
    cuisine: 'Modern Mediterranean',
    neighborhood: 'Salamanca',
    phone: '+573104482052',
    image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '4',
    name: 'Triciclo',
    cuisine: 'Contemporary Spanish',
    neighborhood: 'Barrio de las Letras',
    phone: '+573104482052',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '5',
    name: 'Picalagartos Sky Bar',
    cuisine: 'Rooftop Tapas',
    neighborhood: 'Gran Vía',
    phone: '+573104482052',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '6',
    name: 'Sala de Despiece',
    cuisine: 'Experimental',
    neighborhood: 'Chamberí',
    phone: '+573104482052',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '7',
    name: 'Botín',
    cuisine: 'Historic Castilian',
    neighborhood: 'La Latina',
    phone: '+573104482052',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '8',
    name: 'El Paraguas',
    cuisine: 'Fine Asturian',
    neighborhood: 'Salamanca',
    phone: '+573104482052',
    image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '9',
    name: 'Taberna El Sur',
    cuisine: 'Cozy Local Tapas',
    neighborhood: 'Huertas',
    phone: '+573104482052',
    image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '10',
    name: 'Charrúa Madrid',
    cuisine: 'Uruguayan Grill',
    neighborhood: 'Justicia',
    phone: '+573104482052',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
  },
]