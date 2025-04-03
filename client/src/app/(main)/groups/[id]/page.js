// filepath: a:\projrect.MERN Stack\kgkjdnkjnkjn\FCM\client\src\app\(main)\groups\[id]\page.js
"use client";

import { useEffect, useState } from 'react';

export default function GroupPage({ params }) {
  const [groupDetails, setGroupDetails] = useState(null);

  useEffect(() => {
    console.log('Fetching group details for ID:', params.id); // Debug log
    async function fetchGroupDetails() {
      const response = await fetch(`/api/groups/${params.id}`);
      const data = await response.json();
      console.log('Fetched group details:', data); // Debug log
      setGroupDetails(data);
    }
    fetchGroupDetails();
  }, [params.id]);

  return (
    <div>
      <h1>Group Page for ID: {params.id}</h1>
      {groupDetails ? (
        <pre>{JSON.stringify(groupDetails, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}