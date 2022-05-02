using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class floating : MonoBehaviour
{
    public float ampl = 1.0f;
    public float freq = 2.0f;
    public float phase = 0.0f;
    private Vector3 initialPosition;

    void Start()
    {
        initialPosition = transform.position;
    }

    void Update()
    {
        transform.position = new Vector3(initialPosition.x, initialPosition.y + ampl * Mathf.Sin(Time.time * freq + phase), initialPosition.z);
    }
}
