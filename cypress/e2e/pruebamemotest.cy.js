const URL = " http://192.168.0.187:8080"
const cantidad_cuadros = 12;


context('Memotest', () =>{

  before(() => {
    cy.visit(URL);
  });

  describe('juega al memotest', ()=>{
    
    it ('Se asegura que haya un tablero con cuadros', ()=>{
      cy.get('#tablero').find('.cuadro').should('have.length',cantidad_cuadros);
    });

    

    it('Se asegura que los cuadros sean aleatorios', () => {
      cy.visit(URL);
      cy.get('.cuadro').then(cuadros => {
        let clasesOriginales = [];
        cuadros.each(function(i,cuadro){
          clasesOriginales.push(cuadro.className);
        });

        cy.visit(URL);

        let clasesNuevas = [];
        cy.get('.cuadro').then(nuevosCuadros => {
          nuevosCuadros.each(function(i,cuadro){
            clasesNuevas.push(cuadro.className);
          });
          
          cy.wrap(clasesOriginales).should('not.deep.equal', clasesNuevas);
        });
      });
    });
  });

  describe('Resuelve el juego', ()=>{
    let mapaPares, listaPares;
    it('Elige una combinacion erronea', () => {
      cy.visit(URL);
      cy.get('.cuadro').then(cuadros=>{
        mapaPares = obtenerParesDeCuadros(cuadros);
        listaPares = Object.values(mapaPares);

        cy.get(listaPares[0][0]).click;
        cy.get(listaPares[1][0]).click;

        cy.get('.cuadro').should('have.length',cantidad_cuadros);
      });
    });

    it('Resuelve el juego', ()=>{
      cy.visit(URL);
      cy.get('.cuadro').should('have.length', (cantidad_cuadros));

      listaPares.forEach( (par) => {
        cy.get(par[0]).click;
        cy.get(par[1]).click;
      });

      const numeroDeTurnos = cantidad_cuadros / 2+1;
    });
  });
});

function obtenerParesDeCuadros(cuadros) {
  const pares = {};

  cuadros.each((i, cuadro) => {

    const claseColor = cuadro.className.replace('cuadro h-100 ', '');

    if (pares[claseColor]) {
      pares[claseColor].push(cuadro);
    } 
    else {
      pares[claseColor] = [cuadro];
    }
  });

  return pares;
}