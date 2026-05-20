import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [devices, setDevices] = useState([]);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    deviceId: "",
    store: "",
    assignedTo: ""
  });

  // GET devices
  const fetchDevices = () => {
    axios.get("http://localhost:5000/devices")
      .then(res => setDevices(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  // handle input changes
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // POST device
  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post("http://localhost:5000/devices", form)
      .then(() => {
        setForm({ deviceId: "", store: "", assignedTo: "" });
        fetchDevices(); // refresh table
      })
      .catch(err => console.log(err));
  };

              const checkout = (id) => {
                axios.patch(`http://localhost:5000/devices/${id}/checkout`, {
                  assignedTo: "Managers Office"
                })
                
                .then(() => {
                  fetchDevices();
                })

                .catch(err => console.log(err));
              };

              const checkin = (id) => {
                axios.patch(`http://localhost:5000/devices/${id}/checkin`, {
                  by: "David Ray"
                })

                .then(() => {
                  fetchDevices();
                })

                .catch(err => console.log(err));
              };

  return (
    <div className="App">
      <h1>JD Sports Handheld Tracker</h1>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            marginBottom: "20px",
            flexWrap: "wrap"
          }}
        >
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "20px",
              width: "180px",
              backgroundColor: "#f8f8f8"
            }}
          >
            <h3>Total Devices</h3>
            <h2>{devices.length}</h2>
          </div>

          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "20px",
              width: "180px",
              backgroundColor: "#f8f8f8"
            }}
          >
            <h3>Checked-in</h3>
            <h2>
              {
                devices.filter(
                  d => d.status === "Checked-in"
                ).length
              }
            </h2>
          </div>  
          
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "20px",
              width: "180px",
              backgroundColor: "#f8f8f8"
            }}
          >
            <h3>Checked-out</h3>
            <h2>
              {
                devices.filter(
                  d => d.status === "Checked-out"
                ).length
              }
            </h2>
          </div>
        
        </div>
        
      {/* FORM */}
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          name="deviceId"
          placeholder="Device ID"
          value={form.deviceId}
          onChange={handleChange}
        />

        <input
          name="store"
          placeholder="Store #"
          value={form.store}
          onChange={handleChange}
        />

        <input
          name="assignedTo"
          placeholder="Assigned To"
          value={form.assignedTo}
          onChange={handleChange}
        />

        <button type="submit">Add Device</button>
      </form>

        <input
          type="text"
          placeholder="Search Devices..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            marginBottom: "20px",
            padding: "10px",
            width: "300px"
          }}
        />

      {/* TABLE */}
      <table
        style={{
          margin: "auto",
          marginTop: "20px",
          borderCollapse: "collapse",
          width: "80%"
        }}
      >
        <thead>
          <tr>
            <th style={{backgroundColor: "#f2f2f2", padding: "10px"}}>
              Device ID
            </th>

            <th style={{backgroundColor: "#f2f2f2", padding: "10px"}}>
              Store #
            </th>

            <th style={{backgroundColor: "#f2f2f2", padding: "10px"}}>
              Assignee
            </th>

            <th style={{backgroundColor: "#f2f2f2", padding:"10px"}}>
              Status
            </th>

            <th style={{backgroundColor: "#f2f2f2", padding:"10px"}}>
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {devices
            .filter((device) => {
              const searchLower = search.toLocaleLowerCase();
              return (
                (device.deviceId || device.deviceId || "")
                  .toLocaleLowerCase()
                  .includes(searchLower) ||

                (device.store || "")
                  .toLowerCase()
                  .includes(searchLower) ||

                (device.assignedTo || "")
                  .toLowerCase()
                  .includes(searchLower)
                
              );
            })
            .map((device) => (
              <tr key={device._id}>
                <td>{device.deviceId || device.deviceId}</td>
                <td>{device.store}</td>
                <td>{device.assignedTo}</td>
                <td style={{
                  color:
                    device.status === "Checked-in"
                      ? "green"
                      : device.status === "Checked-out"
                      ? "red"
                      : "orange",
                  fontWeight: "bold"
                }}>
                  {device.status}
                </td>
                <td style={{ padding: "10px" }}>
                  <button
                    onClick={() => checkout(device._id)}
                    style={{
                      marginRight: "10px",
                      backgroundColor: "#ff4d4d",
                      color: "white",
                      border: "none",
                      padding: "8px",
                      cursor: "pointer",
                      borderRadius: "5px",
                    }}
                  >
                    Check Out
                  </button>

                  <button
                    onClick={() => checkin(device._id)}
                    style={{
                      backgroundColor: "#4CAF50",
                      color: "white",
                      border: "none",
                      padding: "8px",
                      cursor: "pointer",
                      borderRadius: "5px",
                    }}
                  >
                    Check In
                  </button>
                </td>
              </tr>
            ))} 
        </tbody>
      </table>
    </div>
  );
}

export default App;