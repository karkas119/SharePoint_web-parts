SP.SOD.executeFunc("sp.js", "SP.ClientContext", ourFunction);

function ourFunction() {
  const WEBContext = new SP.ClientContext(_spPageContextInfo.webAbsoluteUrl);
  const web = WEBContext.get_web();
  const List = web.get_lists().getByTitle("Список сотрудников");
  const dateToday = moment().format();
  const dateTodayLess = moment()
    .subtract(14, "days")
    .format();

  const query = `<View><Query><Where><And><Geq>
    <FieldRef Name='_x0414__x0430__x0442__x0430__x00' />
    <Value Type='Text'>${dateTodayLess}</Value>
    </Geq>
    <Leq><FieldRef Name='_x0414__x0430__x0442__x0430__x00' />
    <Value Type='Text'>${dateToday}</Value>
    </Leq>
    </And>
    </Where></Query></View>`;

  const camlQuery = new SP.CamlQuery();
  camlQuery.set_viewXml(query);

  const ListItems = List.getItems(camlQuery);
  WEBContext.load(ListItems);

  WEBContext.executeQueryAsync(
    Function.createDelegate(this, onGetListItemsSucceeded),
    Function.createDelegate(this, onQueryFailed)
  );
  function onGetListItemsSucceeded() {
    const employees = ListItems.get_data();
    const sortedEmployees = employees.reduce((acc, item) => {
      const employee = item.get_fieldValues();
      if (!acc) {
        acc = [];
      }
      acc.push(employee);
      return acc;
    }, []);

    function showEmployee() {
      const employeesHTML = sortedEmployees.map(item => {
        return `
                <div class ="card" style="width: 27%; float: left; margin: 0 1% 0 1%;">
                <img class="card-img-top" src="${item._x0424__x043e__x0442__x043e_.get_url()}" alt="Card image cap" />
                <div class = "cardbody">               
                <h5 class="card-title" style="font-family:Roboto, sans-serif">${
                  item.Title
                }</h5>    
                <p class="card-text">Дата рождения:</p>
                <p class="card-text">${moment(
                  item._x0414__x0430__x0442__x0430__x00
                ).format("LL")}</p>  
                </div>
                </div>
                `;
      });
      const finalHTML = employeesHTML.join("");
      document.getElementById("injection").innerHTML = finalHTML;
    }
    showEmployee();
  }

  function onQueryFailed(sender, args) {
    console.log(sender);
    console.log(args.get_message());
  }
}
