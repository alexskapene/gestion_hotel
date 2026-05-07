
export default function AdminDashboardPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-4">Bienvenue sur le Dashboard Admin</h1>
      <p className="text-muted-foreground mb-6">
        Ici, vous pouvez gérer les utilisateurs, les commandes, les produits et plus encore.
      </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white/10 p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-2">Utilisateurs</h2>
                <p className="text-sm text-muted-foreground">Gérez les comptes utilisateurs, les rôles et les permissions.</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-2">Commandes</h2>
                <p className="text-sm text-muted-foreground">Visualisez et gérez les commandes passées par les clients.</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-2">Produits</h2>
                <p className="text-sm text-muted-foreground">Ajoutez, modifiez ou supprimez des produits de votre catalogue.</p>
            </div>
        </div>
    </div>
  );
}