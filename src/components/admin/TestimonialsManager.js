'use client';
import CrudManager from './CrudManager';

const config = {
  title: 'Testimonials',
  subtitle: 'Client words shown on the Home page',
  endpoint: '/api/admin/testimonials',
  addLabel: '+ Add Testimonial',
  blank: { quote: '', name: '', eventType: '', visible: true, order: 0 },
  fields: [
    { key: 'quote', label: 'Testimonial', type: 'multiline', required: true },
    { key: 'name', label: 'Client name', type: 'text' },
    { key: 'eventType', label: 'Event type', type: 'text', helper: 'Example: Wedding, Corporate Event' },
    { key: 'order', label: 'Order (smaller shows first)', type: 'number' },
  ],
  titleKey: 'name',
  subKey: 'quote',
  emptyText: 'No testimonials yet. The testimonial section stays hidden on the Home page until you add one.',
};

export default function TestimonialsManager(props) {
  return <CrudManager config={config} {...props} />;
}