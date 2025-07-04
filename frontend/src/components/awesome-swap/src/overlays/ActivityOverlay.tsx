export const ActivityOverlay = () => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold mb-4">Activity</h2>
        <p className="text-muted-foreground">
          Transaction history will be displayed here.
        </p>
      </div>
    </div>
  );
}; 