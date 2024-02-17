import * as THREE from "three";

export class Grid{
  public x: number = -0.5;
  public y: number = -0.5;
  public width: number = 256;
  public height: number = 128;
  public sizeStep: number = 1;
  private gridLineGeometries: THREE.BufferGeometry[] = []

  public dispose(){
    this.gridLineGeometries.map(g=>g.dispose())
  }
  public createLines(material: THREE.LineBasicMaterial){
    this.dispose()
    const result:THREE.Line<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.LineBasicMaterial, THREE.Object3DEventMap>[] = []
    var gridWidthWithStep = this.width * this.sizeStep;
    var gridHeightWithStep = this.height * this.sizeStep;
    for (var i = 0; i < this.width+1; i++)
    {
      const points = [];
      const from = i * this.sizeStep + this.x;
      points.push( new THREE.Vector3( from, this.y ) );
      points.push( new THREE.Vector3( from, gridHeightWithStep + this.y ) );
      const geometry = new THREE.BufferGeometry().setFromPoints( points );
      this.gridLineGeometries.push(geometry)
      result.push(new THREE.Line( geometry, material ))
    }
    for (var i = 0; i < this.height+1; i++)
    {
      const points = [];
      const to = i * this.sizeStep + this.y;
      points.push( new THREE.Vector3( this.x, to ) );
      points.push( new THREE.Vector3( gridWidthWithStep + this.x, to ) );
      const geometry = new THREE.BufferGeometry().setFromPoints( points );
      this.gridLineGeometries.push(geometry)
      result.push(new THREE.Line( geometry, material ))
    }
    return result
  }
}