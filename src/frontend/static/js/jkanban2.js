const API_URL = "{{ url_api }}";


let draggedPosition;

// Récupère les éléments d'un board spécifique
async function fetchItems(boardId) {
  const response = await fetch(API_URL + 'boards/' + boardId);
  const data = await response.json();
  console.log(data);
  return data.items.map(item => ({
    id: item.id_item,
    title: item.title,
    position: item.position,
    board: item.board
  }));
}

// 
fetch(API_URL + 'boards/')
  .then(response => response.json())
  .then(async (data) => {
    console.log(data)
    const boards = data.map(board => ({
      id: board.id_board,
      title: board.title,
      position: board.position,
      items: [],
    }));
    // Attendre que tous les éléments soient récupérés pour chaque board
    await Promise.all(boards.map(async (board) => {
      const items = await fetchItems(board.id);
      console.log(items);
      board.items = items; // Assignez directement les éléments récupérés au tableau
    }));
    
    //Instantiation de jkanban
    const kanban = new jKanban({
      element: "#myKanban",
      gutter: "10px",
      widthBoard: "450px",
      dragItems: true,
      dragBoards: true,
      itemHandleOptions: {
        enabled: true,
      },
      click: function(el) {
        console.log("Trigger on all items click!");
      },
      context: function(el, e) {
        console.log("Trigger on all items right-click!");
      },
      dragEl: function (el, source) {},
      dragendEl: function (el) {},
      dropEl: function(el, target, source, sibling) {},
      dragBoard: function (el, source) {
        // Récupération de l'ID du tableau en cours de déplacement
        const boardId = el.getAttribute('data-id');
        draggedPosition = el.getAttribute('data-order');
        console.log("board déplacé: " + boardId + "Position initial: " + draggedPosition)
      },
      dragendBoard: async function (el) {
        const boardId = el.dataset.id;
        const oldPosition = parseInt(draggedPosition);
        const newPosition = parseInt(el.dataset.order);

        console.log('Moved board ' + boardId + ' from position ' + oldPosition + ' to position ' + newPosition);

        // Mettre à jour la position du tableau déplacé
        try {
          const updatePosition = await fetch(API_URL + 'boards/' + boardId + '/', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              position: newPosition
            })
          });
          console.log('Position of board ' + boardId + ' updated successfully');
        } catch (error) {
          console.log('Error updating position of board ' + boardId + ':', error);
        }

        // Mettre à jour les positions des autres boards
        boards.forEach(async (board) => {
          const currentPosition = board.position;
          let updatedPosition = currentPosition;

          if (board.id !== boardId) {
            if (oldPosition < newPosition) {
              if (currentPosition > oldPosition && currentPosition <= newPosition) {
                updatedPosition = currentPosition - 1;
              }
            } else {
              if (currentPosition >= newPosition && currentPosition < oldPosition) {
                updatedPosition = currentPosition + 1;
              }
            }
          }

          if (currentPosition !== updatedPosition) {
            console.log("Board " + board.id + " moved from position " + currentPosition + " to position " + updatedPosition);
            const updatePosition = fetch(API_URL + 'boards/' + board.id + '/', {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                position: updatedPosition
              })
            });

            try {
              await updatePosition;
              console.log('Position of board ' + board.id + ' updated successfully');
              board.position = updatedPosition; // Mettre à jour la position du tableau dans la variable 'boards'
            } catch (error) {
              console.log('Error updating position of board ' + board.id + ':', error);
            }
          }
        });
      },
      buttonClick: function(el, boardId) {
        console.log(el);
        console.log(boardId);
        // create a form to enter element
        var formItem = document.createElement("form");
        formItem.setAttribute("class", "itemform");
        formItem.innerHTML =
          '<div class="form-group"><textarea class="form-control" rows="2" autofocus></textarea></div><div class="form-group"><button type="submit" class="btn btn-primary btn-xs pull-right">Submit</button><button type="button" id="CancelBtn" class="btn btn-default btn-xs pull-right">Cancel</button></div>';

        kanban.addForm(boardId, formItem);
        
        formItem.addEventListener("submit", function(e) {
          e.preventDefault();
          var text = e.target[0].value;
          
          // Envoi de la requête POST pour créer une nouvelle carte dans la base de données
          fetch(API_URL + 'items/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              title: text,
              position: 0, // position par défaut
              board: boardId // L'ID du board auquel la carte doit être ajoutée
            })
          })
          .then(response => response.json())
          .then(data => {
            console.log(data)
            // Récupération de l'ID de la nouvelle carte créée
            const newItemId = data.id_item;
            if (!newItemId) {
              throw new Error('ID manquant pour la nouvelle carte');
            }
            
            // Ajout de la nouvelle carte au board correspondant sur l'interface utilisateur
            kanban.addElement(boardId, {
              id: newItemId,
              title: text
            });
          })
          .catch(error => console.log('Error: ', error));

          formItem.parentNode.removeChild(formItem);
        });

        document.getElementById("CancelBtn").onclick = function() {
          formItem.parentNode.removeChild(formItem);
        };
      },
      propagationHandlers: [],  
      itemAddOptions: {
        enabled: true,
        content: '+ Add New Card',
        class: 'custom-button',
        footer: true
      },
      boards: boards
    });

  
    // Ajout d'un événement clic pour le titre du tableau
    kanban.container.addEventListener('click', function (e) {
      if (e.target.classList.contains('kanban-title-board')) {
        const boardId = e.target.parentNode.parentNode.dataset.id;
        const newTitle = prompt('Enter new title');
        if (newTitle !== null && newTitle !== '') {
          // Envoi de la requête PATCH pour mettre à jour le titre du tableau dans la base de données
          fetch(API_URL + 'boards/' + boardId + '/', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              title: newTitle
            })
          })
          .then(response => response.json())
          .then(data => {
            // Mise à jour du titre du tableau sur l'interface utilisateur
            e.target.textContent = newTitle;
          })
          .catch(error => console.log('Error: ', error));
        }
      }
    });

    
    // Envoi d'une requête POST à l'API pour créer un nouveau board
    var addBoardDefault = document.getElementById("addDefault");
    addBoardDefault.addEventListener("click", function() {
      // Envoi de la requête POST pour créer un nouveau board avec une position par défaut de 0
      fetch(API_URL + 'boards/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: 'Default Board',
          position: 0 // position par défaut
        })
      })
      .then(response => response.json())
      .then(data => {
        // Récupération de l'ID du nouveau board créé
        const newBoardId = data.id_board;
        if (!newBoardId) {
          throw new Error('Missing ID for new board');
        }

        // Récupération de la liste des boards existants
        fetch(API_URL + 'boards/')
            .then(response => response.json())
            .then(data => {
                // Parcours de la liste des boards pour récupérer la dernière position
                let lastPosition = 0;
                data.forEach(board => {
                    if (board.position > lastPosition) {
                        lastPosition = board.position;
                    }
                });
                // Modification de la position du nouveau board
                fetch(API_URL + 'boards/' + newBoardId + "/", {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        position: lastPosition + 1 // nouvelle position
                    })
                })
                .then(response => response.json())
                .then(data => {
                    // Ajout du nouveau board à la fin de la liste des boards existants
                    const newBoard = {
                        id: newBoardId.toString(),
                        title: 'Default Board',
                        item: []
                    };

                    kanban.addBoards([newBoard]);
                    
                })
                .catch(error => console.log('Error: ', error));
            })
            .catch(error => console.log('Error: ', error));
      })
    })
  })
