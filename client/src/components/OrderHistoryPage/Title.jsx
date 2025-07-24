const Title = ( {stats} ) => {
    return (
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-6 shadow-lg" style={{background: 'linear-gradient(135deg, #1F55A3 0%, #245FA6 100%)'}}>
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <h1 className="text-3xl font-bold">Mes Commandes</h1>
            <div className="text-right">
              <p className="text-lg font-medium">{stats.total} commandes</p>
              <p className="text-sm opacity-90">au total</p>
            </div>
          </div>
        </div>
    )
};
export default Title;