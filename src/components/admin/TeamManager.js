'use client';
import CrudManager from './CrudManager';

const config = {
  title: 'Team',
  subtitle: 'Shown on the About page',
  endpoint: '/api/admin/team',
  addLabel: '+ Add Team Member',
  blank: { name: '', role: '', bio: '', photo: null, photoThumb: null, visible: true, order: 0 },
  fields: [
    { key: 'name', label: 'Name', type: 'text', required: true },
    { key: 'role', label: 'Role', type: 'text', helper: 'Example: Founder, Event Designer' },
    { key: 'bio', label: 'Short bio (optional)', type: 'multiline' },
    { key: 'photo', label: 'Photo', type: 'image' },
    { key: 'order', label: 'Order (smaller shows first)', type: 'number' },
  ],
  titleKey: 'name',
  subKey: 'role',
  imageThumbKey: 'photoThumb',
  emptyText: 'No team members yet. The Team section stays hidden on the About page until you add one.',
};

export default function TeamManager(props) {
  return <CrudManager config={config} {...props} />;
}
